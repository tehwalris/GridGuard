import { original, produce } from "immer";
import _ from "lodash";
import { Action, ActionType } from "./interfaces/action";
import { State, User } from "./interfaces/state";
import { unreachable } from "./util";

const historySize = 20;
export const tickMillis = 500;

function getPowerConsumption(tick: number, toggles: State["toggles"]): number {
  const poweredToggles = countPoweredToggles(toggles);
  return getBasePowerConsumptionFromTick(tick) * (poweredToggles + 8);
}

function getBasePowerConsumptionFromTick(tick: number): number {
  return 1000 + Math.sin(tick / 3) * 100;
}

function getPowerProduction(tick: number, meanProduction: number): number {
  return meanProduction * (1 + 0.05 * Math.sin((tick + 2) / 2.5));
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
  ].map((key, i) => ({ key, powered: (i + 1) % 3 !== 0 }));
  const poweredToggles = countPoweredToggles(toggles);
  const meanProduction = (poweredToggles + 0.2) * 1000;
  return {
    users: [],
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
      case ActionType.TickSimulation: {
        state.simulationHistory.shift();
        state.simulationHistory.push(
          _.cloneDeep(original(state.simulation) ?? state.simulation),
        );
        state.simulation.tick++;
        const poweredToggles = countPoweredToggles(state.toggles);
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
