import { produce } from "immer";
import _ from "lodash";
import { Action, ActionType } from "./interfaces/action";
import { State, User } from "./interfaces/state";
import { unreachable } from "./util";

export function makeInitialState(): State {
  return {
    users: [],
    toggles: [
      "dishwasher",
      "fridge",
      "microwave",
      "oven",
      "light",
      "heater",
    ].map((key, i) => ({ key, powered: (i + 1) % 3 !== 0 })),
    simulation: {
      recentPowerConsumption: _.times(20, (i) => 1000 + Math.sin(i) * 100),
    },
  };
}

export const initialState: State = makeInitialState();

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
        state.users.push({ id: action.userId });
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
      default: {
        unreachable(action);
      }
    }
  });
