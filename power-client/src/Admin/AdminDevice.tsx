import { Switch } from "@mantine/core";
import { ActionType } from "power-shared";
import React from "react";
import { RunAction } from "../useUnilog";

export interface Device {
  key: string;
  powered: boolean;
}

interface Props {
  device: Device;
  runAction: RunAction;
}

function AdminDevice({ device, runAction }: Props) {
  return (
    <div>
      {device.key}:
      <Switch
        checked={device.powered}
        onChange={(event) =>
          runAction(() => {
            return {
              type: ActionType.SetToggle,
              key: device.key,
              powered: event.currentTarget.checked,
            };
          })
        }
        onLabel="ON"
        offLabel="OFF"
      />
    </div>
  );
}

export default AdminDevice;
