import { Stack, createStyles } from "@mantine/core";
import React from "react";
import { RunAction } from "../useUnilog";
import AdminDevice, { Device } from "./AdminDevice";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
}));

interface Props {
  devices: Device[];
  runAction: RunAction;
}

function AdminDeviceList({ devices, runAction }: Props) {
  const { classes } = useStyles();

  return (
    <Stack p="lg" className={classes.container}>
      Devices
      {devices.map((device) => (
        <AdminDevice device={device} runAction={runAction} />
      ))}
    </Stack>
  );
}

export default AdminDeviceList;
