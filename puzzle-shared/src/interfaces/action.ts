import { DateNumber, GameSettings, GridLocation } from "./state";

export type Action =
  | JoinAsPlayerAction
  | ShowImagePreviewNowAction
  | StartGameAction
  | GivePieceAction
  | PlacePieceAction
  | ChangeSettingsAction
  | AddUserAction
  | RemoveUserAction
  | RestartLobbyAction;

export enum ActionType {
  JoinAsPlayer = "JoinAsPlayer",
  ShowImagePreviewNow = "ShowImagePreviewNow",
  StartGame = "StartGame",
  GivePiece = "GivePiece",
  PlacePiece = "PlacePiece",
  ChangeSettings = "ChangeSettings",
  AddUser = "AddUser",
  RemoveUser = "RemoveUser",
  RestartLobby = "RestartLobby",
}

export interface JoinAsPlayerAction {
  type: ActionType.JoinAsPlayer;
  userId: string;
  player: number;
  name: string;
}

export interface ShowImagePreviewNowAction {
  type: ActionType.ShowImagePreviewNow;
}

export interface StartGameAction {
  type: ActionType.StartGame;
  now: DateNumber;
  seed: number; // integer
}

export interface GivePieceAction {
  type: ActionType.GivePiece;
  userId: string;
  now: DateNumber;
  piece: number;
  toPlayer: number;
}

export interface PlacePieceAction {
  type: ActionType.PlacePiece;
  userId: string;
  piece: number; // must be owned by player
  target: GridDestination;
}

export interface ChangeSettingsAction {
  type: ActionType.ChangeSettings;
  userId: string;
  settings: Partial<GameSettings>;
}

export interface RestartLobbyAction {
  type: ActionType.RestartLobby;
  userId: string;
}

export interface AddUserAction {
  type: ActionType.AddUser;
  userId: string;
}

export interface RemoveUserAction {
  type: ActionType.RemoveUser;
  userId: string;
}

export enum GridName {
  Main = "Main",
  Temp = "Temp",
}

export enum MoveDestinationType {
  Grid = "Grid",
  Player = "Player",
}

export type MoveDestination = GridDestination | PlayerDestination;

export interface GridDestination {
  type: MoveDestinationType.Grid;
  grid: GridName;
  location: GridLocation; // always global
}

export interface PlayerDestination {
  type: MoveDestinationType.Player;
  player: number;
}
