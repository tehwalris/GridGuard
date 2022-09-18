export interface State {
  users: User[];
  devices: Device[];
  deviceIndicesForAllUsers: number[];
  deviceIndicesById: { [id: string]: number | undefined };
  meanProduction: number;
  autoAdjust: boolean;
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
  targetSavingRatio: number;
}

export interface SimulationState {
  tick: number;
  powerConsumption: GridPowerConsumption;
  powerProduction: number;
}

export interface GridPowerConsumption {
  total: number;
  totalWithoutSavings: number;
  byDeviceClass: { [key: string]: number | undefined };
  byDeviceClassWithoutSavings: { [key: string]: number | undefined };
}

export interface Device {
  id: string;
  deviceClassKey: string;
  powerConsumption: number;
  powerConsumptionWithoutSavings: number;
  forAllUsers: boolean; // make sure that all users see "own" this device at the same time
}
