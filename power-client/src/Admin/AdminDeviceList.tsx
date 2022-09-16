import { createStyles, Stack } from "@mantine/core";
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
        <AdminDevice key={device.key} device={device} runAction={runAction} />
      ))}
    </Stack>
  );
}

export default AdminDeviceList;
