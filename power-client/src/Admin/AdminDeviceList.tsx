import { Stack, createStyles } from "@mantine/core";
import React from "react";
import AdminDevice, { Device } from "./AdminDevice";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
}));

interface Props {
  devices: Device[];
}

function AdminDeviceList({ devices }: Props) {
  const { classes } = useStyles();

  return (
    <Stack p="lg" className={classes.container}>
      Devices
      {devices.map((device) => (
        <AdminDevice device={device} />
      ))}
    </Stack>
  );
}

export default AdminDeviceList;
