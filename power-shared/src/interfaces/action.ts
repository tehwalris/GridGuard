import { Device, GridPowerConsumption } from "./state";

export type Action =
  | AddUserAction
  | RemoveUserAction
  | SetToggleAction
  | StartEventAction
  | EndEventAction
  | TickSimulationAction;

export enum ActionType {
  AddUser = "AddUser",
  RemoveUser = "RemoveUser",
  SetToggle = "SetToggle",
  StartEvent = "StartEvent",
  EndEvent = "EndEvent",
  TickSimulation = "TickSimulation",
}

export interface AddUserAction {
  type: ActionType.AddUser;
  userId: string;
}

export interface RemoveUserAction {
  type: ActionType.RemoveUser;
  userId: string;
}

export interface SetToggleAction {
  type: ActionType.SetToggle;
  key: string;
  powered: boolean;
}
export interface StartEventAction {
  type: ActionType.StartEvent;
}
export interface EndEventAction {
  type: ActionType.EndEvent;
}
export interface TickSimulationAction {
  type: ActionType.TickSimulation;
  devices: Device[]; // only a subset of devices for perf reasons
  powerConsumption: GridPowerConsumption; // from all devices, not just the subset
}
