import _ from "lodash";
import randomNormal from "random-normal";
import { v4 as genUuid } from "uuid";
import {
  DeviceClientMessage,
  DeviceServerMessage,
  MessageType,
  PreferenceDeviceServerMessage,
} from "./interfaces/message";
import { Device, DeviceClassToggle } from "./interfaces/state";
import {
  allDeviceClassKeysSorted,
  gridMeanPower,
  nonSmartRatio,
} from "./reducer";
import { sleep, unreachable } from "./util";

enum DeviceClientLifecycle {
  BeforeStart,
  Running,
  Stopped,
}

function copyDevice(device: Device): Device {
  return { ...device };
}

export class DeviceServer {
  private clients: DeviceClient[] = [];
  private devices = new Map<string, Device>();
  private deviceIdByClient = new WeakMap<DeviceClient, string>();
  private allowPoweredByClient = new WeakMap<DeviceClient, boolean>();
  private randomnessByClient = new WeakMap<DeviceClient, number>();

  private onMessage(msg: DeviceClientMessage, client: DeviceClient) {
    switch (msg.type) {
      case MessageType.CreateDeviceClient:
        const existingDeviceId = this.deviceIdByClient.get(client);
        if (
          existingDeviceId !== undefined &&
          existingDeviceId !== msg.deviceId
        ) {
          console.warn("overwriting device");
        }
        this.deviceIdByClient.set(client, msg.deviceId);
        this.devices.set(msg.deviceId, {
          id: msg.deviceId,
          deviceClassKey: msg.deviceClassKey,
          powerConsumption: 0,
          powerConsumptionWithoutSavings: 0,
          forAllUsers: msg.forAllUsers,
        });
        break;
      case MessageType.ReportDeviceClient:
        const deviceId = this.deviceIdByClient.get(client);
        if (deviceId === undefined) {
          return;
        }
        const device = this.devices.get(deviceId);
        if (!device) {
          return;
        }
        device.powerConsumption = msg.powerConsumption;
        device.powerConsumptionWithoutSavings =
          msg.powerConsumptionWithoutSavings;
        break;
      default:
        return unreachable(msg);
    }
  }

  addClient(client: DeviceClient) {
    this.clients.push(client);
    this.randomnessByClient.set(client, Math.random());
    client.start((msg) => this.onMessage(msg, client));
  }

  stop() {
    for (const client of this.clients) {
      client.stop();
    }
    this.clients = [];
    this.devices = new Map();
    this.deviceIdByClient = new WeakMap();
  }

  getDevices(limit: number | undefined): Device[] {
    const devices: Device[] = [];
    for (const device of this.devices.values()) {
      devices.push(copyDevice(device));
      if (limit !== undefined && devices.length >= limit) {
        break;
      }
    }
    return devices;
  }

  setToggles(toggles: DeviceClassToggle[]) {
    const toggleByDeviceClassKey = new Map<string, DeviceClassToggle>();
    for (const toggle of toggles) {
      toggleByDeviceClassKey.set(toggle.key, toggle);
    }

    for (const client of this.clients) {
      const deviceId = this.deviceIdByClient.get(client);
      if (deviceId === undefined) {
        continue;
      }
      const device = this.devices.get(deviceId);
      if (!device) {
        continue;
      }
      const toggle = toggleByDeviceClassKey.get(device.deviceClassKey);
      if (!toggle) {
        continue;
      }
      const allowPowered =
        (this.randomnessByClient.get(client) ?? 0.5) > toggle.targetSavingRatio;
      if (allowPowered === this.allowPoweredByClient.get(client)) {
        continue;
      }
      this.allowPoweredByClient.set(client, allowPowered);
      client.onMessage({
        type: MessageType.PreferenceDeviceServer,
        allowPowered,
      });
    }
  }
}

abstract class DeviceClient {
  private lifecycleState: DeviceClientLifecycle =
    DeviceClientLifecycle.BeforeStart;
  protected sendMessage: ((msg: DeviceClientMessage) => void) | undefined;

  start(sendMessage: (msg: DeviceClientMessage) => void) {
    if (this.lifecycleState !== DeviceClientLifecycle.BeforeStart) {
      throw new Error("device has already been started");
    }
    this.sendMessage = sendMessage;
    this.runUntilStopped();
  }

  stop() {
    if (this.lifecycleState !== DeviceClientLifecycle.Running) {
      throw new Error("device is not running");
    }
    this.sendMessage = undefined;
    this.lifecycleState = DeviceClientLifecycle.Stopped;
  }

  private async runUntilStopped(): Promise<void> {
    while (!this.isStopped()) {
      try {
        await this.run();
      } catch (err) {
        console.error("Device crashed", err);
      }
    }
  }

  protected abstract run(): Promise<void>;

  abstract onMessage(msg: DeviceServerMessage): void;

  protected isStopped(): boolean {
    return this.lifecycleState === DeviceClientLifecycle.Stopped;
  }

  onButtonPressed(): void {}
}

class LegacyDeviceClient extends DeviceClient {
  private latestAllowPowered = true;

  constructor(
    private deviceId: string,
    private deviceClassKey: string,
    private typicalPowerConsumption: number,
  ) {
    super();
  }

  protected async run(): Promise<void> {
    this.sendMessage?.({
      type: MessageType.CreateDeviceClient,
      deviceId: this.deviceId,
      deviceClassKey: this.deviceClassKey,
      forAllUsers: false,
    });
    this.setPowered(true);
    while (!this.isStopped()) {
      await sleep(5000);
    }
  }

  async onMessage(msg: PreferenceDeviceServerMessage): Promise<void> {
    this.latestAllowPowered = msg.allowPowered;
    await sleep(Math.random() * 5000);
    this.setPowered(this.latestAllowPowered);
  }

  private setPowered(powered: boolean) {
    this.sendMessage?.({
      type: MessageType.ReportDeviceClient,
      powerConsumption: powered ? this.typicalPowerConsumption : 0,
      powerConsumptionWithoutSavings: this.typicalPowerConsumption,
    });
  }
}

class SometimesOnDeviceClient extends DeviceClient {
  private latestAllowPowered = true;
  private wantsToBePowered = false;
  private latestButtonTimeout: NodeJS.Timeout | undefined;

  constructor(
    private deviceId: string,
    private deviceClassKey: string,
    private typicalPowerConsumption: number,
    private typicalOnTime: number,
    private typicalOffTime: number,
    private typicalResponseTime: number,
    private autoOnOff: boolean,
    private forAllUsers: boolean,
    private onSetPowered: (powered: boolean) => void,
  ) {
    super();
  }

  protected async run(): Promise<void> {
    this.sendMessage?.({
      type: MessageType.CreateDeviceClient,
      deviceId: this.deviceId,
      deviceClassKey: this.deviceClassKey,
      forAllUsers: this.forAllUsers,
    });

    if (!this.autoOnOff) {
      this.wantsToBePowered = false;
      this.autoSetPowered();
      while (!this.isStopped()) {
        await sleep(5000);
      }
      return;
    }

    const initiallyPowered =
      Math.random() <
      this.typicalOnTime / (this.typicalOnTime + this.typicalOffTime);
    this.wantsToBePowered = initiallyPowered;
    this.autoSetPowered();
    if (initiallyPowered) {
      await sleep(Math.random() * this.noisyTime(this.typicalOnTime));
      this.wantsToBePowered = false;
      this.autoSetPowered();
    } else {
      await sleep(Math.random() * this.noisyTime(this.typicalOffTime));
      this.wantsToBePowered = true;
      this.autoSetPowered();
      await sleep(this.noisyTime(this.typicalOnTime));
      this.wantsToBePowered = false;
      this.autoSetPowered();
    }
    while (!this.isStopped()) {
      await sleep(this.noisyTime(this.typicalOffTime));
      this.wantsToBePowered = true;
      this.autoSetPowered();
      await sleep(this.noisyTime(this.typicalOnTime));
      this.wantsToBePowered = false;
      this.autoSetPowered();
    }
  }

  async onMessage(msg: PreferenceDeviceServerMessage): Promise<void> {
    this.latestAllowPowered = msg.allowPowered;
    await sleep(Math.max(0, randomNormal() + 1) * this.typicalResponseTime);
    this.autoSetPowered();
  }

  private setPowered(powered: boolean) {
    this.onSetPowered(powered);
    this.sendMessage?.({
      type: MessageType.ReportDeviceClient,
      powerConsumption: powered ? this.typicalPowerConsumption : 0,
      powerConsumptionWithoutSavings: this.wantsToBePowered
        ? this.typicalPowerConsumption
        : 0,
    });
  }

  private autoSetPowered() {
    this.setPowered(this.wantsToBePowered && this.latestAllowPowered);
  }

  private noisyTime(time: number): number {
    return Math.max(0, randomNormal() * 0.5 + 1) * time;
  }

  onButtonPressed(): void {
    clearTimeout(this.latestButtonTimeout);
    this.latestButtonTimeout = undefined;

    if (this.wantsToBePowered) {
      this.wantsToBePowered = false;
      this.autoSetPowered();
    } else {
      this.wantsToBePowered = true;
      this.autoSetPowered();
      this.latestButtonTimeout = setTimeout(() => {
        this.wantsToBePowered = false;
        this.autoSetPowered();
      }, this.typicalOnTime);
    }
  }
}

export function createVirtualDevices(
  deviceCount: number,
  onMicrowaveChange: (powered: boolean) => void,
): { deviceClients: DeviceClient[]; realMicrowaveIndex: number | undefined } {
  const settingsByDeviceClass: {
    [key: string]:
      | { typicalOnTime: number; typicalOffTime: number }
      | undefined;
  } = {
    fridge: { typicalOnTime: 10000, typicalOffTime: 40000 },
    microwave: { typicalOnTime: 45000, typicalOffTime: 400000 },
    oven: { typicalOnTime: 100000, typicalOffTime: 700000 },
    light: { typicalOnTime: 30000, typicalOffTime: 30000 },
    heater: { typicalOnTime: 800000, typicalOffTime: 600000 },
  };

  let realMicrowaveIndex: number | undefined;

  // TODO HACK need to scale this down to realistic values and scale up somewhere else
  const targetPower = gridMeanPower * (1 - nonSmartRatio);
  const deviceClients = _.times(deviceCount, (i) => {
    const deviceClass =
      allDeviceClassKeysSorted[
        Math.floor(Math.random() * allDeviceClassKeysSorted.length)
      ];
    if (deviceClass === "microwave" && realMicrowaveIndex === undefined) {
      realMicrowaveIndex = i;
    }
    const settings = settingsByDeviceClass[deviceClass] ?? {
      typicalOnTime: 10000,
      typicalOffTime: 40000,
    };
    const dutyCycle =
      settings.typicalOnTime /
      (settings.typicalOnTime + settings.typicalOffTime);
    return new SometimesOnDeviceClient(
      genUuid(),
      deviceClass,
      targetPower / deviceCount / dutyCycle,
      settings.typicalOnTime,
      settings.typicalOffTime,
      i === realMicrowaveIndex ? 500 : 4000,
      i !== realMicrowaveIndex,
      i === realMicrowaveIndex,
      (powered) => {
        if (i === realMicrowaveIndex) {
          // TODO this merges events from multiple microwaves together
          onMicrowaveChange(powered);
        }
      },
    );
  });

  return { deviceClients, realMicrowaveIndex };
}
