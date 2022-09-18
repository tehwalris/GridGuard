import { createStyles, Group, Switch } from "@mantine/core";
import { DeviceClassToggle } from "power-shared";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
}));

interface Props {
  device: DeviceClassToggle;
  onTargetSavingsRatioChange: (targetSavingsRatio: number) => void;
}

function AdminDevice({ device, onTargetSavingsRatioChange }: Props) {
  const { classes } = useStyles();
  const niceDeviceKey =
    device.key.charAt(0).toUpperCase() + device.key.slice(1);
  return (
    <Group className={classes.container} position="apart">
      <Group spacing={5}>
        <img height={24} src={"/" + device.key + ".svg"} alt="" />
        <div>{niceDeviceKey}</div>
      </Group>
      <Switch
        size="lg"
        checked={device.targetSavingRatio > 0}
        onChange={(event) =>
          onTargetSavingsRatioChange(event.currentTarget.checked ? 1 : 0)
        }
        onLabel="ON"
        offLabel="OFF"
      />
    </Group>
  );
}

export default AdminDevice;
