import Prando from "prando";
import { Device, SimulationState, State, User } from "./interfaces/state";

export interface DeviceSimulationState {
  id: string;
  powered: boolean;
  powerConsumption: number;
  powerConsumptionWithoutSavings: number;
  deviceAffected: boolean;
  deviceClassAffected: boolean;
}

export function selectUser(state: State, userId: string): User | undefined {
  const users = state.users;
  return users.find((u) => u.id === userId);
}

export function selectUserDevices(state: State, userId: string): Device[] {
  // HACK the devices that a user "owns" will change if devices are added or removed from the system

  if (!state.devices.length) {
    return [];
  }

  const user = selectUser(state, userId);
  if (!user) {
    return [];
  }

  const prando = new Prando(user.seed);

  const seenDeviceClassKeys = new Set<string>();
  const userDevices = [];
  for (let i = 0; i < 7; i++) {
    const j = prando.nextInt(0, state.devices.length - 1);
    const device = state.devices[j];
    if (seenDeviceClassKeys.has(device.deviceClassKey)) {
      continue;
    }
    seenDeviceClassKeys.add(device.deviceClassKey);
    userDevices.push(device);
  }

  return userDevices;
}

export function selectUserDeviceSimulationStates(
  state: State,
  userId: string,
): DeviceSimulationState[] {
  return selectUserDevices(state, userId)
    .map((device) => selectDeviceSimulationState(state, device.id))
    .filter((v) => v)
    .map((v) => v!);
}

export function selectDeviceSimulationState(
  state: State,
  deviceId: string,
): DeviceSimulationState | undefined {
  const deviceIndex = state.deviceIndicesById[deviceId];
  if (deviceIndex === undefined) {
    return undefined;
  }
  const device = state.devices[deviceIndex];
  const deviceClassToggle = state.toggles.find(
    (toggle) => toggle.key === device.deviceClassKey,
  );
  if (!deviceClassToggle) {
    return undefined;
  }
  return {
    id: deviceId,
    powered: device.powerConsumption > 0,
    powerConsumption: device.powerConsumption,
    powerConsumptionWithoutSavings: device.powerConsumptionWithoutSavings,
    deviceClassAffected: deviceClassToggle.targetSavingRatio > 0,
    deviceAffected:
      device.powerConsumptionWithoutSavings > device.powerConsumption,
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
