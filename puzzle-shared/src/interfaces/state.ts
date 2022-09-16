export type DateNumber = number; // milliseconds, to pass to new Date(...)

export interface State {
  phaseState: PhaseState;
  gameSettings: GameSettings;
  puzzleDefinition: PuzzleDefinition;
  solution: Solution;
  players: Player[]; // 4 elements
  users: User[];
}

export enum Phase {
  PreGame = "PreGame",
  Distributing = "Distributing",
  Solving = "Solving",
  PostGame = "PostGame",
}

export type PhaseState =
  | PreGameState
  | DistributingState
  | SolvingState
  | PostGameState;

export interface PreGameState {
  phase: Phase.PreGame;
  showImagePreviewNow: boolean;
}

export interface DistributingState {
  phase: Phase.Distributing;
  pieceStartTime: DateNumber; // reset after each piece is distributed
  distributor: number; // index of player
  toDistribute: number[][]; // toDistribute[playerIndex] is an array of piece indices, pop() to get next piece
  totalToDistribute: number; // sum of all toDistribute length before any distribution occurs
}

export interface SolvingState {
  phase: Phase.Solving;
  startTime: DateNumber;
  numberOfSwaps: number;
}

export interface PostGameState {
  phase: Phase.PostGame;
  numberOfSwaps: number;
  totalGameTime: number; //in seconds
}

export interface User {
  id: string;
  player?: number | null;
}

export interface PuzzleDefinition {
  pieces: PieceDefinition[]; // row major
  size: GridSize; // in pieces
  imageURL: string;
  tileHeight: number; //pixels
  tileWidth: number; //pixels
}

export interface PieceDefinition {}

export type GridPlacement = (number | null)[][]; // value is index into PuzzleDefinition.pieces

export interface Solution {
  pieces: GridPlacement;
}

export interface Player {
  name: string;
  tempSpace: GridPlacement;
  recentReceives: RecentReceive[];
  finished: boolean;
}

export interface RecentReceive {
  piece: number;
  fromPlayerName: string;
}

export interface GridSize {
  height: number;
  width: number;
}

export interface GridLocation {
  row: number;
  column: number;
}

export interface GridLocationRange {
  from: GridLocation; // inclusive
  to: GridLocation; // inclusive; must be >= from
}

export enum NumberOfTiles {
  Few = "Few",
  Medium = "Medium",
  Many = "Many",
}

export enum DistributionTime {
  Short = "Short",
  Medium = "Medium",
  Long = "Long",
}

export interface GameSettings {
  image: ImageWithSize;
  roughNumberOfTiles: NumberOfTiles;
  distributionTime: DistributionTime;
  enableImagePreview: boolean;
}

export interface ImageWithSize {
  url: string;
  width: number;
  height: number;
}
