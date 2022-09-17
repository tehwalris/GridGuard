import { original, produce } from "immer";
import _ from "lodash";
import { Action, ActionType } from "./interfaces/action";
import { State, User } from "./interfaces/state";
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

function getPowerProduction(
  tick: number,
  meanProduction: number,
  eventOngoing: boolean,
): number {
  return (
    (eventOngoing ? 0.95 : 1) *
      meanProduction *
      (1 + 0.005 * Math.sin((tick + 2) / 2.5)) +
    Math.random() / 100
  );
}

function countPoweredToggles(toggles: State["toggles"]): number {
  return toggles.filter((t) => t.powered).length;
}

export function makeInitialState(): State {
  const toggles: State["toggles"] = [
    "dishwasher",
    "fridge",
    "microwave",
    "oven",
    "light",
    "heater",
  ].map((key, i) => ({ key, powered: true }));
  const meanProduction = gridMeanPower;
  return {
    users: [],
    meanProduction,
    toggles,
    simulation: {
      tick: historySize,
      powerConsumption: getPowerConsumption(historySize, toggles),
      powerProduction: getPowerProduction(historySize, meanProduction, false),
    },
    simulationHistory: _.times(historySize, (i) => ({
      tick: i,
      powerConsumption: getPowerConsumption(i, toggles),
      powerProduction: getPowerProduction(i, meanProduction, false),
    })),
    eventOngoing: false,
  };
}

function makeInitialUser(id: string): User {
  return {
    id,
    devices: [
      { id: `dishwasher-${id}-0`, deviceClassKey: "dishwasher" },
      { id: `fridge-${id}-0`, deviceClassKey: "fridge" },
      { id: `oven-${id}-0`, deviceClassKey: "oven" },
    ],
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
        state.eventOngoing = true;
        state.simulation.powerProduction = getPowerProduction(
          historySize,
          state.meanProduction,
          true,
        );

        break;
      }
      case ActionType.EndEvent: {
        state.eventOngoing = false;
        state.simulation.powerProduction = getPowerProduction(
          historySize,
          state.meanProduction,
          false,
        );
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
