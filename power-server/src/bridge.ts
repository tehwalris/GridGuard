import { Socket } from "net";

export class PhysicalDeviceBridge {
  private isSending = false;
  private lastSent: boolean | undefined;
  private lastQueued: boolean = false;
  private lastSentAt: number | undefined;
  private resendIfOlderThanMillis = 2000;

  constructor(private ip: string, private port: number) {}

  setPowered(powered: boolean) {
    console.log("DEBUG setPowered", powered);

    this.lastQueued = powered;
    this.startSendIfNeeded();
  }

  private startSendIfNeeded() {
    if (
      !this.isSending &&
      (this.lastQueued !== this.lastSent ||
        !this.lastSentAt ||
        Date.now() - this.lastSentAt > this.resendIfOlderThanMillis)
    ) {
      this.send();
    }
  }

  private send() {
    this.isSending = true;

    const socket = new Socket();
    socket.setNoDelay();
    socket.setTimeout(1000);
    socket.on("timeout", () => {
      socket.end();
    });
    let thisSent: boolean | undefined;
    socket.on("close", (hadError) => {
      this.isSending = false;
      if (!hadError) {
        this.lastSent = thisSent;
        this.lastSentAt = Date.now();
      }
      setImmediate(this.startSendIfNeeded.bind(this));
    });
    socket.on("error", (err) => {
      console.warn("PhysicalDeviceBridge send error", err);
    });
    socket.connect(this.port, this.ip, () => {
      thisSent = this.lastQueued;
      socket.write(thisSent ? "on\n" : "off\n");
      console.log("DEBUG sent", thisSent);
    });
  }
}
