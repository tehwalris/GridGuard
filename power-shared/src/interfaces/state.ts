export type DateNumber = number; // milliseconds, to pass to new Date(...)

export interface State {
  users: User[];
  toggles: MachineToggle[];
  simulation: SimulationState;
}

export interface User {
  id: string;
  player?: number | null;
}

export interface MachineToggle {
  key: string;
  powered: boolean;
}

export interface SimulationState {
  recentPowerConsumption: number[];
}
