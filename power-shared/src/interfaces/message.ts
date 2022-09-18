import { State } from "..";
import { Action } from "./action";

export interface LogEntry {
  id: number;
  undoKey?: string;
  action: Action;
}

export enum MessageType {
  LogEntryServer = "LogEntryServer",
  RemapEntryServer = "RemapEntryServer",
  RejectEntryServer = "RejectEntryServer",
  InitialServer = "InitialServer",
  ReportUndoServer = "ReportUndoServer",
  SubmitEntryClient = "SubmitEntryClient",
  RequestUndoClient = "RequestUndoClient",
  PreferenceDeviceServer = "PreferenceDeviceServer",
  CreateDeviceClient = "CreateDeviceClient",
  ReportDeviceClient = "ReportDeviceClient",
}

export type ServerMessage =
  | InitialServerMessage
  | LogEntryServerMessage
  | RemapEntryServerMessage
  | RejectEntryServerMessage
  | ReportUndoServerMessage;

export interface InitialServerMessage {
  type: MessageType.InitialServer;
  initialState: State;
  userId: string;
}

export interface LogEntryServerMessage {
  type: MessageType.LogEntryServer;
  entry: LogEntry;
}

export interface RemapEntryServerMessage {
  type: MessageType.RemapEntryServer;
  oldId: number;
  entry: LogEntry;
}

export interface RejectEntryServerMessage {
  type: MessageType.RejectEntryServer;
  entryId: number;
  error: string;
}

export interface ReportUndoServerMessage {
  type: MessageType.ReportUndoServer;
  undoKey: string;
  finalEntryId: number;
  finalState: State;
}

export type ClientMessage = SubmitEntryClientMessage | RequestUndoClientMessage;

export interface SubmitEntryClientMessage {
  type: MessageType.SubmitEntryClient;
  entry: LogEntry;
}

export interface RequestUndoClientMessage {
  type: MessageType.RequestUndoClient;
  undoKey: string;
}

export type DeviceServerMessage = PreferenceDeviceServerMessage;

export interface PreferenceDeviceServerMessage {
  type: MessageType.PreferenceDeviceServer;
  allowPowered: boolean;
}

export type DeviceClientMessage =
  | CreateDeviceClientMessage
  | ReportDeviceClientMessage;

export interface CreateDeviceClientMessage {
  type: MessageType.CreateDeviceClient;
  deviceId: string;
  deviceClassKey: string;
  forAllUsers: boolean;
}

export interface ReportDeviceClientMessage {
  type: MessageType.ReportDeviceClient;
  powerConsumption: number;
  powerConsumptionWithoutSavings: number;
}
