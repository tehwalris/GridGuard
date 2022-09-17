export interface State {
  users: User[];
  devices: Device[];
  deviceIndicesById: { [id: string]: number | undefined };
  meanProduction: number;
  toggles: DeviceClassToggle[];
  simulation: SimulationState;
  simulationHistory: SimulationState[];
  eventOngoing: boolean;
}

export interface User {
  id: string;
  seed: number;
}

export interface DeviceClassToggle {
  key: string;
  powered: boolean;
}

export interface SimulationState {
  tick: number;
  powerConsumption: GridPowerConsumption;
  powerProduction: number;
}

export interface GridPowerConsumption {
  total: number;
  byDeviceClass: { [key: string]: number | undefined };
  byDeviceClassWithoutSavings: { [key: string]: number | undefined };
}

export interface Device {
  id: string;
  deviceClassKey: string;
  powerConsumption: number;
  powerConsumptionWithoutSavings: number;
}
