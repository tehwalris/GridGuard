import { State } from "./interfaces/state";

export interface DeviceSimulationState {
  id: string;
  powered: boolean;
  powerConsumption: number;
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
