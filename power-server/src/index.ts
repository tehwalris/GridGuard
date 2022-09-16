import cors from "cors";
import timesyncServer from "timesync/server";
import express from "express";
import * as R from "ramda";
import { v4 as genId } from "uuid";
import {
  Action,
  ActionType,
  ClientMessage,
  initialState,
  LogEntry,
  MessageType,
  reducer,
  ServerMessage,
  State,
  unreachable,
  lobbyCodeFromUrl,
} from "puzzle-shared";
import WebSocket from "ws";

const LOBBY_TIMEOUT_MS = 1000 * 60 * 5;
const LOBBY_CODE_LENGTH = 6;

interface UndoPoint {
  firstEntryId: number;
  stateBeforeEntry: State;
}

const app = express();
app.use(cors());

class Lobby {
  private log: LogEntry[] = [];
  private state: State = initialState;
  private undoneUndoKeys = new Set<string>();
  private undoPoints = new Map<string, UndoPoint>();
  private lastConnectedAt = Date.now();
  private clients = new Set<WebSocket>();

  private pushToLog(action: Action, undoKey: string | undefined): LogEntry {
    const nextState = reducer(this.state, action); // test if the reducer throws when the action is applied
    const newEntry: LogEntry = { id: this.log.length + 1, action, undoKey };
    this.log.push(newEntry);
    if (undoKey && !this.undoPoints.has(undoKey)) {
      this.undoPoints.set(undoKey, {
        firstEntryId: newEntry.id,
        stateBeforeEntry: this.state,
      });
    }
    this.state = nextState;
    return newEntry;
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
              error: err.toString(),
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
          if (this.undoneUndoKeys.has(msg.undoKey)) {
            console.warn(`${msg.undoKey} has already been undone`);
            return;
          }
          const undoPoint = this.undoPoints.get(msg.undoKey);
          if (!undoPoint) {
            console.warn(
              `${msg.undoKey} ocurred too long ago to be undone (or never ocurred)`,
            );
            return;
          }

          this.undoneUndoKeys.add(msg.undoKey);

          this.state = undoPoint.stateBeforeEntry;
          for (let i = undoPoint.firstEntryId - 1; i < this.log.length; i++) {
            const logEntry = this.log[i];

            if (logEntry.undoKey) {
              const oldUndoPoint = this.undoPoints.get(logEntry.undoKey);
              if (!oldUndoPoint) {
                throw new Error("expected undo point to exist");
              }
              if (oldUndoPoint.firstEntryId === logEntry.id) {
                this.undoPoints.set(logEntry.undoKey, {
                  ...oldUndoPoint,
                  stateBeforeEntry: this.state,
                });
              }
            }

            if (logEntry.undoKey && this.undoneUndoKeys.has(logEntry.undoKey)) {
              continue;
            }

            try {
              this.state = reducer(this.state, logEntry.action);
            } catch (err) {
              console.warn(
                `action from entry ${logEntry.id} failed after undo: ${err}`,
              );
            }
          }

          const finalLogEntry = R.last(this.log);
          if (!finalLogEntry) {
            throw new Error("unexpected empty log");
          }

          const outMsg: ServerMessage = {
            type: MessageType.ReportUndoServer,
            undoKey: msg.undoKey,
            finalEntryId: finalLogEntry.id,
            finalState: this.state,
          };
          sendToSelf(outMsg);
          sendToOthers(outMsg);

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
      lobbies.delete(lobbyCode);
    }
  }
}, LOBBY_TIMEOUT_MS);

wss.on("connection", (ws, request) => {
  try {
    console.log("ws connect", request.url);

    const lobbyCode = lobbyCodeFromUrl(request.url!);
    let lobby = lobbies.get(lobbyCode);
    if (!lobby) {
      lobby = new Lobby();
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
