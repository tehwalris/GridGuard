import { DeviceClientMessage, DeviceServerMessage } from "./interfaces/message";
import { Device } from "./interfaces/state";

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

  private onMessage(msg: DeviceClientMessage) {
    // TODO
  }

  addClient(client: DeviceClient) {
    this.clients.push(client);
    client.start(this.onMessage.bind(this));
  }

  stop() {
    for (const client of this.clients) {
      client.stop();
    }
    this.clients = [];
  }

  getDevices(): Device[] {
    const devices: Device[] = [];
    for (const device of this.devices.values()) {
      devices.push(copyDevice(device));
    }
    return devices;
  }
}

export abstract class DeviceClient {
  private lifecycleState: DeviceClientLifecycle =
    DeviceClientLifecycle.BeforeStart;
  protected sendMessage: ((msg: DeviceClientMessage) => void) | undefined;

  start(sendMessage: (msg: DeviceClientMessage) => void) {
    this.sendMessage = sendMessage;
  }

  stop() {
    this.sendMessage = undefined;
    // TODO
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

  onMessage(msg: DeviceServerMessage) {
    // TODO
  }

  protected isStopped(): boolean {
    return this.lifecycleState === DeviceClientLifecycle.Stopped;
  }
}
