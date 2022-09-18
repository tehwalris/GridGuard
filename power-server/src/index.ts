import cors from "cors";
import express from "express";
import {
  Action,
  ActionType,
  ClientMessage,
  createVirtualDevices,
  DeviceServer,
  getPowerConsumption,
  LogEntry,
  LogEntryServerMessage,
  makeInitialState,
  MessageType,
  reducer,
  ServerMessage,
  State,
  tickMillis,
  unreachable,
} from "power-shared";
import timesyncServer from "timesync/server";
import { v4 as genId } from "uuid";
import WebSocket from "ws";
import { PhysicalDeviceBridge } from "./bridge";

const LOBBY_TIMEOUT_MS = 1000 * 60 * 5;

interface UndoPoint {
  firstEntryId: number;
  stateBeforeEntry: State;
}

const app = express();
app.use(cors());

const simulatedDeviceCount = 50000;
const shownDeviceCount = 300;

const microwaveIp = process.env["MICROWAVE_IP"] || "192.168.88.192";
const microwavePort = parseInt(process.env["MICROWAVE_PORT"] || "80");

class Lobby {
  private logLength: number = 0;
  private state: State = makeInitialState();
  private lastConnectedAt = Date.now();
  private clients = new Set<WebSocket>();
  private tickHandle: NodeJS.Timer | undefined;
  private deviceServer = new DeviceServer();
  private microwaveBridge = new PhysicalDeviceBridge(
    microwaveIp,
    microwavePort,
  );

  private pushToLog(action: Action, undoKey: string | undefined): LogEntry {
    const nextState = reducer(this.state, action); // test if the reducer throws when the action is applied
    const newEntry: LogEntry = { id: this.logLength + 1, action, undoKey };
    this.logLength++;
    this.state = nextState;
    return newEntry;
  }

  private onTick = () => {
    this.deviceServer.setToggles(this.state.toggles);
    const tick = this.state.simulation.tick + 1;
    const entry = this.pushToLog(
      {
        type: ActionType.TickSimulation,
        devices: this.deviceServer.getDevices(shownDeviceCount),
        powerConsumption: getPowerConsumption(
          tick,
          this.deviceServer.getDevices(undefined),
        ),
      },
      undefined,
    );
    const msg: LogEntryServerMessage = {
      type: MessageType.LogEntryServer,
      entry,
    };
    const msgString = JSON.stringify(msg);
    for (const ws of this.clients) {
      ws.send(msgString);
    }
  };

  start() {
    this.stop();
    this.tickHandle = setInterval(this.onTick, tickMillis);
    this.deviceServer = new DeviceServer();
    const { deviceClients, realMicrowaveIndex } = createVirtualDevices(
      simulatedDeviceCount,
      (powered) => this.microwaveBridge.setPowered(powered),
    );
    for (const deviceClient of deviceClients) {
      this.deviceServer.addClient(deviceClient);
    }
    this.microwaveBridge.start(() => {
      if (realMicrowaveIndex !== undefined) {
        deviceClients[realMicrowaveIndex].onButtonPressed();
      }
    });
  }

  stop() {
    clearInterval(this.tickHandle);
    this.deviceServer.stop();
    this.microwaveBridge.stop();
  }

  shouldBeDeleted(): boolean {
    return (
      !this.state.users.length &&
      Date.now() - this.lastConnectedAt > LOBBY_TIMEOUT_MS
    );
  }

  onConnection(ws: WebSocket) {
    this.clients.add(ws);
    this.lastConnectedAt = Date.now();

    const sendToSelf = (msg: ServerMessage) => {
      ws.send(JSON.stringify(msg));
    };
    const sendToOthers = (msg: ServerMessage) => {
      for (const otherWs of this.clients) {
        if (otherWs !== ws) {
          otherWs.send(JSON.stringify(msg));
        }
      }
    };

    const userId = genId();
    sendToOthers({
      type: MessageType.LogEntryServer,
      entry: this.pushToLog({ type: ActionType.AddUser, userId }, undefined),
    });

    sendToSelf({
      type: MessageType.InitialServer,
      initialState: this.state,
      userId,
    });

    ws.on("close", () => {
      this.clients.delete(ws);

      sendToOthers({
        type: MessageType.LogEntryServer,
        entry: this.pushToLog(
          { type: ActionType.RemoveUser, userId },
          undefined,
        ),
      });
    });

    ws.on("message", (_msg) => {
      const msg: ClientMessage = JSON.parse(_msg.toString());
      switch (msg.type) {
        case MessageType.SubmitEntryClient: {
          let newEntry: LogEntry;
          try {
            newEntry = this.pushToLog(msg.entry.action, msg.entry.undoKey);
          } catch (err) {
            sendToSelf({
              type: MessageType.RejectEntryServer,
              entryId: msg.entry.id,
              error: (err as any)?.toString(),
            });
            return;
          }
          sendToSelf({
            type: MessageType.RemapEntryServer,
            oldId: msg.entry.id,
            entry: newEntry,
          });
          sendToOthers({
            type: MessageType.LogEntryServer,
            entry: newEntry,
          });
          break;
        }
        case MessageType.RequestUndoClient: {
          console.warn("HACK the undo feature was removed");
          break;
        }
        default:
          unreachable(msg);
      }
    });
  }
}

const wss = new WebSocket.Server({ noServer: true });

const lobbies = new Map<string, Lobby>();
setInterval(() => {
  for (const [lobbyCode, lobby] of lobbies.entries()) {
    if (lobby.shouldBeDeleted()) {
      lobby.stop();
      lobbies.delete(lobbyCode);
    }
  }
}, LOBBY_TIMEOUT_MS);

wss.on("connection", (ws, request) => {
  try {
    console.log("ws connect", request.url);

    const lobbyCode = "HACK";
    let lobby = lobbies.get(lobbyCode);
    if (!lobby) {
      lobby = new Lobby();
      lobby.start();
      lobbies.set(lobbyCode, lobby);
    }

    lobby.onConnection(ws);
  } catch (error) {
    console.error("error in websocket handler", error);
  }
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const port = process.env.PORT || 8088;
const server = app.listen(port);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

console.log("listening on port", port);
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});
app.post("/timesync", timesyncServer.requestHandler);
