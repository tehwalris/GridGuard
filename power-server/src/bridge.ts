import { Socket } from "net";

export class PhysicalDeviceBridge {
  private isSending = false;
  private lastSent: boolean | undefined;
  private lastQueued: boolean = false;
  private lastSentAt: number | undefined;
  private resendIfOlderThanMillis = 250;
  private interval: NodeJS.Timer | undefined;
  private onButtonPressed: (() => void) | undefined;

  constructor(private ip: string, private port: number) {}

  start(onButtonPressed: () => void) {
    this.stop();
    this.interval = setInterval(() => this.startSendIfNeeded(), 10);
    this.onButtonPressed = onButtonPressed;
  }

  stop() {
    clearInterval(this.interval);
    this.interval = undefined;
  }

  setPowered(powered: boolean) {
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
    let firstByteReceived: number | undefined;
    let didClose = false;
    socket.on("data", (data) => {
      if (firstByteReceived === undefined && data.length) {
        firstByteReceived = data[0];
      }
    });
    socket.on("close", (hadError) => {
      didClose = true;
      this.isSending = false;
      if (!hadError && thisSent !== undefined) {
        this.lastSent = thisSent;
        this.lastSentAt = Date.now();
      }
      if (firstByteReceived === "t".charCodeAt(0)) {
        console.log("button pressed");
        this.onButtonPressed?.();
      }
      setImmediate(this.startSendIfNeeded.bind(this));
    });
    socket.on("error", (err) => {
      // console.warn("PhysicalDeviceBridge send error", err);
    });
    socket.connect(this.port, this.ip, () => {
      if (socket.readyState !== "open") {
        console.warn("socket not open in connect");
        return;
      }
      thisSent = this.lastQueued;
      socket.write(thisSent ? "on\n" : "off\n");
    });

    setTimeout(() => {
      // HACK in some cases the socket doesn't seem to close or timeout
      // avoid blocking in those cases
      if (!didClose) {
        this.isSending = false;
        setImmediate(this.startSendIfNeeded.bind(this));
      }
    }, 2000);
  }
}
