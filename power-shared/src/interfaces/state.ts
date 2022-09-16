export type DateNumber = number; // milliseconds, to pass to new Date(...)

export interface State {
  users: User[];
}

export interface User {
  id: string;
  player?: number | null;
}
