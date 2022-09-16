import { Switch } from "@mantine/core";
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
        onChange={(event) => console.log(event.currentTarget.checked)}
        onLabel="ON"
        offLabel="OFF"
      />
    </div>
  );
}

export default AdminDevice;
