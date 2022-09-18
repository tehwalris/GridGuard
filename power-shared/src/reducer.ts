import { original, produce } from "immer";
import _ from "lodash";
import Prando from "prando";
import R from "ramda";
import { Action, ActionType } from "./interfaces/action";
import { Device, GridPowerConsumption, State, User } from "./interfaces/state";
import { unreachable } from "./util";

const historySize = 20;
export const tickMillis = 500;

export const nonSmartRatio = 0.8;

const gridYearlyEnergy = 58.1 * 1e9 * 1000; // Wh
export const gridMeanPower = gridYearlyEnergy / (365 * 24); // W

export function getPowerConsumption(
  tick: number,
  devices: Device[],
): GridPowerConsumption {
  let total = 0;
  let totalWithoutSavings = 0;
  const byDeviceClass: { [key: string]: number | undefined } = {};
  const byDeviceClassWithoutSavings: { [key: string]: number | undefined } = {};
  for (const deviceClassKey of allDeviceClassKeys) {
    byDeviceClass[deviceClassKey] = 0;
    byDeviceClassWithoutSavings[deviceClassKey] = 0;
  }

  const temp = gridMeanPower * getBasePowerConsumptionFromTick(tick);
  total += temp * nonSmartRatio;
  totalWithoutSavings += temp * nonSmartRatio;

  for (const device of devices) {
    total += device.powerConsumption;
    totalWithoutSavings += device.powerConsumptionWithoutSavings;
    byDeviceClass[device.deviceClassKey]! += device.powerConsumption;
    byDeviceClassWithoutSavings[device.deviceClassKey]! +=
      device.powerConsumptionWithoutSavings;
  }

  return {
    total,
    totalWithoutSavings,
    byDeviceClass,
    byDeviceClassWithoutSavings,
  };
}

function getBasePowerConsumptionFromTick(tick: number): number {
  return 1;
}

function getPowerProduction(
  tick: number,
  meanProduction: number,
  eventOngoing: boolean,
): number {
  return meanProduction * (eventOngoing ? 0.95 : 1);
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

export const allDeviceClassKeys = new Set([
  "dishwasher",
  "fridge",
  "microwave",
  "oven",
  "light",
  "heater",
]);
export const allDeviceClassKeysSorted = R.sortBy(
  (v) => v,
  [...allDeviceClassKeys],
);

export function makeInitialState(): State {
  const meanProduction = gridMeanPower;
  const toggles: State["toggles"] = allDeviceClassKeysSorted.map((key) => ({
    key,
    targetSavingRatio: 0,
  }));

  const prando = new Prando();
  const devices: Device[] = [];
  for (let i = 0; i < 50; i++) {
    const deviceClassKey = prando.nextArrayItem(allDeviceClassKeysSorted);
    const id = prando.nextString(32);
    devices.push({
      id,
      deviceClassKey,
      powerConsumption: 3.14,
      powerConsumptionWithoutSavings: 3.14,
    });
  }

  const getPowerConsumptionHacked = (tick: number) => {
    const powerConsumption = getPowerConsumption(tick, devices);
    powerConsumption.total /= nonSmartRatio;
    return powerConsumption;
  };

  return {
    users: [],
    devices,
    deviceIndicesById: makeDeviceIndicesById(devices),
    meanProduction,
    toggles,
    autoAdjust: false,
    simulation: {
      tick: historySize,
      powerConsumption: getPowerConsumptionHacked(historySize),
      powerProduction: getPowerProduction(historySize, meanProduction, false),
    },
    simulationHistory: _.times(historySize, (i) => ({
      tick: i,
      powerConsumption: getPowerConsumptionHacked(i),
      powerProduction: getPowerProduction(i, meanProduction, false),
    })),
    eventOngoing: false,
  };
}

function makeInitialUser(id: string): User {
  return {
    id,
    seed: (new Prando(id) as any).hashCode(id), // HACK
  };
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
            toggle.targetSavingRatio = action.targetSavingRatio;
            return;
          }
        }
        throw new Error(`toggle does not exist: ${action.key}`);
      }
      case ActionType.SetAutoAdjust: {
        state.autoAdjust = action.autoAdjust;
      }
      case ActionType.StartEvent: {
        state.eventOngoing = true;
        break;
      }
      case ActionType.EndEvent: {
        state.eventOngoing = false;
        break;
      }
      case ActionType.TickSimulation: {
        if (
          !action.devices.every((device) =>
            allDeviceClassKeys.has(device.deviceClassKey),
          )
        ) {
          throw new Error("invalid device class key");
        }
        state.devices = action.devices;
        state.deviceIndicesById = makeDeviceIndicesById(action.devices);
        state.meanProduction = _.mean(
          state.simulationHistory.map(
            (v) => v.powerConsumption.totalWithoutSavings,
          ),
        );
        state.simulationHistory.shift();
        state.simulationHistory.push(
          _.cloneDeep(original(state.simulation) ?? state.simulation),
        );
        state.simulation.tick++;
        state.simulation.powerConsumption = action.powerConsumption;
        state.simulation.powerProduction = getPowerProduction(
          historySize,
          state.meanProduction,
          state.eventOngoing,
        );
        if (state.autoAdjust) {
          for (const toggle of state.toggles) {
            const targetSavingAbsolute =
              state.simulation.powerConsumption.totalWithoutSavings -
              state.simulation.powerProduction;
            const smartDeviceConsumptionWithoutSavings = _.sum(
              Object.values(
                state.simulation.powerConsumption.byDeviceClassWithoutSavings,
              ).map((v) => v ?? 0),
            );
            const targetSavingRatio =
              targetSavingAbsolute / smartDeviceConsumptionWithoutSavings;
            const oldTargetSavingRatio = toggle.targetSavingRatio;
            toggle.targetSavingRatio = Math.max(
              0,
              Math.min(1, targetSavingRatio),
            );
            const maxStepSize = 0.03;
            toggle.targetSavingRatio = Math.max(
              oldTargetSavingRatio - maxStepSize,
              Math.min(
                toggle.targetSavingRatio + maxStepSize,
                toggle.targetSavingRatio,
              ),
            );
            if (toggle.targetSavingRatio < 0.05) {
              toggle.targetSavingRatio = 0;
            }
          }
        }
        break;
      }
      default: {
        unreachable(action);
      }
    }
  });
