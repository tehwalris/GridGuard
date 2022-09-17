import { original, produce } from "immer";
import _ from "lodash";
import Prando from "prando";
import { Action, ActionType } from "./interfaces/action";
import { Device, State, User } from "./interfaces/state";
import { unreachable } from "./util";

const historySize = 20;
export const tickMillis = 500;

const nonSmartRatio = 0.8;

const gridYearlyEnergy = 58.1 * 1e9 * 1000; // Wh
const gridMeanPower = gridYearlyEnergy / (365 * 24); // W

function getPowerConsumption(
  tick: number,
  toggles: State["toggles"],
): { total: number; byDeviceClassWithoutSavings: { [key: string]: number } } {
  let total = 0;
  const byDeviceClassWithoutSavings: { [key: string]: number } = {};
  const temp = gridMeanPower * getBasePowerConsumptionFromTick(tick);
  for (const toggle of toggles) {
    const thisDeviceWithoutSavings =
      (temp * (1 - nonSmartRatio)) / toggles.length;

    byDeviceClassWithoutSavings[toggle.key] = thisDeviceWithoutSavings;
    total += toggle.powered ? thisDeviceWithoutSavings : 0;
  }
  total += temp * nonSmartRatio;
  return { total, byDeviceClassWithoutSavings };
}

function getBasePowerConsumptionFromTick(tick: number): number {
  // TODO can't have math random in reducer
  return (
    1 + 0.005 * Math.sin(tick / 3 + 0.2 * Math.sin(tick)) + Math.random() / 100
  );
}

function getPowerProduction(tick: number, meanProduction: number): number {
  return (
    meanProduction * (1 + 0.005 * Math.sin((tick + 2) / 2.5)) +
    Math.random() / 100
  );
}

function countPoweredToggles(toggles: State["toggles"]): number {
  return toggles.filter((t) => t.powered).length;
}

function makeDeviceIndicesById(devices: Device[]): {
  [id: string]: number | undefined;
} {
  const deviceIndicesById: {
    [id: string]: number | undefined;
  } = {};
  for (const [i, device] of devices.entries()) {
    deviceIndicesById[device.id] = i;
  }
  return deviceIndicesById;
}

export function makeInitialState(): State {
  const deviceClassKeys = [
    "dishwasher",
    "fridge",
    "microwave",
    "oven",
    "light",
    "heater",
  ];
  const meanProduction = gridMeanPower;
  const toggles: State["toggles"] = deviceClassKeys.map((key) => ({
    key,
    powered: true,
  }));

  const prando = new Prando();
  const devices: Device[] = [];
  for (let i = 0; i < 50; i++) {
    const deviceClassKey = prando.nextArrayItem(deviceClassKeys);
    const id = prando.nextString(32);
    devices.push({ id, deviceClassKey, powerConsumption: 3.14 });
  }

  return {
    users: [],
    devices,
    deviceIndicesById: makeDeviceIndicesById(devices),
    meanProduction,
    toggles,
    simulation: {
      tick: historySize,
      powerConsumption: getPowerConsumption(historySize, toggles),
      powerProduction: getPowerProduction(historySize, meanProduction),
    },
    simulationHistory: _.times(historySize, (i) => ({
      tick: i,
      powerConsumption: getPowerConsumption(i, toggles),
      powerProduction: getPowerProduction(i, meanProduction),
    })),
  };
}

function makeInitialUser(id: string): User {
  return {
    id,
    seed: (new Prando(id) as any).hashCode(id), // HACK
  };
}

function requireUser(state: State, action: { userId: string }): User {
  const user = state.users.find((u) => u.id === action.userId);
  if (!user) {
    throw new Error(`unknown user: ${action.userId}`);
  }
  return user;
}

export const reducer = (_state: State, action: Action): State =>
  produce(_state, (state) => {
    switch (action.type) {
      case ActionType.AddUser: {
        if (state.users.find((u) => u.id === action.userId)) {
          throw new Error(`user already exists: ${action.userId}`);
        }
        state.users.push(makeInitialUser(action.userId));
        break;
      }
      case ActionType.RemoveUser: {
        state.users = state.users.filter((u) => u.id !== action.userId);
        break;
      }
      case ActionType.SetToggle: {
        for (const toggle of state.toggles) {
          if (toggle.key === action.key) {
            toggle.powered = action.powered;
            return;
          }
        }
        throw new Error(`toggle does not exist: ${action.key}`);
      }
      case ActionType.StartEvent: {
        state.simulation.powerProduction *= 0.95;
        break;
      }
      case ActionType.EndEvent: {
        state.simulation.powerProduction /= 0.95;
        break;
      }
      case ActionType.TickSimulation: {
        state.simulationHistory.shift();
        state.simulationHistory.push(
          _.cloneDeep(original(state.simulation) ?? state.simulation),
        );
        state.simulation.tick++;
        state.simulation.powerConsumption = getPowerConsumption(
          state.simulation.tick,
          state.toggles,
        );
        break;
      }
      default: {
        unreachable(action);
      }
    }
  });
