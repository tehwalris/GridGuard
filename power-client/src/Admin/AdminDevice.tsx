import { createStyles, Group, Slider, Stack } from "@mantine/core";
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
    <Stack className={classes.container}>
      <Group spacing={5}>
        <img height={24} src={"/" + device.key + ".svg"} alt="" />
        <div>{niceDeviceKey}</div>
      </Group>
      <Slider
        size="lg"
        value={device.targetSavingRatio}
        onChange={(v) => onTargetSavingsRatioChange(v)}
        min={0}
        max={1}
        step={0.01}
        label={(v) =>
          v === 0
            ? "All devices may run"
            : v === 1
            ? "All devices disabled"
            : `${Math.round(v * 100)}% of devices disabled`
        }
      />
    </Stack>
  );
}

export default AdminDevice;
