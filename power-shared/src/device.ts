import _ from "lodash";
import { v4 as genUuid } from "uuid";
import {
  DeviceClientMessage,
  DeviceServerMessage,
  MessageType,
  PreferenceDeviceServerMessage,
} from "./interfaces/message";
import { Device } from "./interfaces/state";
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

  getDevices(): Device[] {
    const devices: Device[] = [];
    for (const device of this.devices.values()) {
      devices.push(copyDevice(device));
    }
    return devices;
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

  protected abstract onMessage(msg: DeviceServerMessage): void;

  protected isStopped(): boolean {
    return this.lifecycleState === DeviceClientLifecycle.Stopped;
  }
}

class LegacyDeviceClient extends DeviceClient {
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
    });
    this.sendMessage?.({
      type: MessageType.ReportDeviceClient,
      powerConsumption: this.typicalPowerConsumption,
      powerConsumptionWithoutSavings: this.typicalPowerConsumption,
    });
    await sleep(5000);
  }

  onMessage(msg: PreferenceDeviceServerMessage): void {
    this.sendMessage?.({
      type: MessageType.ReportDeviceClient,
      powerConsumption: msg.allowPowered ? this.typicalPowerConsumption : 0,
      powerConsumptionWithoutSavings: this.typicalPowerConsumption,
    });
  }
}

export function createVirtualDevices(deviceCount: number): DeviceClient[] {
  // TODO HACK need to scale this down to realistic values and scale up somewhere else
  const targetPower = gridMeanPower * (1 - nonSmartRatio);
  return _.times(
    deviceCount,
    () =>
      new LegacyDeviceClient(
        genUuid(),
        allDeviceClassKeysSorted[
          Math.floor(Math.random() * allDeviceClassKeysSorted.length)
        ],
        targetPower / deviceCount,
      ),
  );
}