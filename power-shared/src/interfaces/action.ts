export type Action = AddUserAction | RemoveUserAction;

export enum ActionType {
  AddUser = "AddUser",
  RemoveUser = "RemoveUser",
}

export interface AddUserAction {
  type: ActionType.AddUser;
  userId: string;
}

export interface RemoveUserAction {
  type: ActionType.RemoveUser;
  userId: string;
}
