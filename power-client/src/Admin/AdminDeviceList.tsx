import { Button, createStyles, Stack, Text } from "@mantine/core";
import { RunAction } from "../useUnilog";
import AdminCard from "./AdminCard";
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
    <AdminCard>
      <Stack p={0} className={classes.container}>
        <Text size={30}>Devices</Text>{" "}
        {devices.map((device) => (
          <AdminDevice key={device.key} device={device} runAction={runAction} />
        ))}
        <Button>Apply</Button>
      </Stack>
    </AdminCard>
  );
}

export default AdminDeviceList;
