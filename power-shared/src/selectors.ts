import { SimulationState, State, User } from "./interfaces/state";

export interface DeviceSimulationState {
  id: string;
  powered: boolean;
  powerConsumption: number;
}

export interface DeviceClassSimulationState {
  key: string;
  powered: boolean;
  powerConsumption: number;
}

export function selectUser(state: State, userId: string): User | undefined {
  const users = state.users;
  return users.find((u) => u.id === userId);
}

export function selectDeviceSimulationState(
  state: State,
  deviceId: string,
): DeviceSimulationState | undefined {
  const device = state.users
    .flatMap((u) => u.devices)
    .find((d) => d.id === deviceId);
  if (!device) {
    return undefined;
  }
  const deviceClassToggle = state.toggles.find(
    (toggle) => toggle.key === device.deviceClassKey,
  );
  if (!deviceClassToggle) {
    return undefined;
  }
  const powered = deviceClassToggle.powered;
  const powerConsumption = powered ? 3.14 : 0;
  return {
    id: deviceId,
    powered,
    powerConsumption,
  };
}

export function selectDeviceClassSimulationState(
  state: State,
  deviceClassKey: string,
): DeviceClassSimulationState | undefined {
  const deviceClassToggle = state.toggles.find(
    (toggle) => toggle.key === deviceClassKey,
  );
  if (!deviceClassToggle) {
    return undefined;
  }
  const powered = deviceClassToggle.powered;
  const powerConsumption =
    state.simulation.powerConsumption.byDeviceClass[deviceClassKey] ?? 0;
  return {
    key: deviceClassKey,
    powered,
    powerConsumption,
  };
}

export function selectLoad(simulationState: SimulationState): number {
  return (
    simulationState.powerConsumption.total / simulationState.powerProduction
  );
}

export function selectRecentLoad(state: State): number[] {
  return state.simulationHistory.map(selectLoad);
}
