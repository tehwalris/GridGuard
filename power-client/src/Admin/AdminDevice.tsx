import { Stack, createStyles } from "@mantine/core";
import React from "react";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
}));

export interface Device {
  key: string;
  powered: boolean;
}

interface Props {
  device: Device;
}

function AdminDevice({ device }: Props) {
  const { classes } = useStyles();

  return (
    <div>
      {device.key}: {device.powered ? "on" : "off"}
    </div>
  );
}

export default AdminDevice;
