import { createStyles, Group, Switch } from "@mantine/core";
import { DeviceClassToggle } from "power-shared";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
}));

interface Props {
  device: DeviceClassToggle;
  onPoweredChange: (powered: boolean) => void;
}

function AdminDevice({ device, onPoweredChange }: Props) {
  const { classes } = useStyles();
  return (
    <Group className={classes.container} position="apart">
      {device.key}:
      <Switch
        checked={device.powered}
        onChange={(event) => onPoweredChange(event.currentTarget.checked)}
        onLabel="ON"
        offLabel="OFF"
      />
    </Group>
  );
}

export default AdminDevice;
