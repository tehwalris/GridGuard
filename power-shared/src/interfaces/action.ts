export type Action = AddUserAction | RemoveUserAction | SetToggleAction;

export enum ActionType {
  AddUser = "AddUser",
  RemoveUser = "RemoveUser",
  SetToggle = "SetToggle",
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
