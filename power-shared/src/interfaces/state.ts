export interface State {
  users: User[];
  toggles: DeviceClassToggle[];
  simulation: SimulationState;
  simulationHistory: SimulationState[];
}

export interface User {
  id: string;
  devices: Device[];
}

export interface DeviceClassToggle {
  key: string;
  powered: boolean;
}

export interface SimulationState {
  tick: number;
  powerConsumption: number;
}

export interface Device {
  id: string;
  deviceClassKey: string;
}
