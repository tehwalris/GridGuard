import { createStyles, Group, Switch } from "@mantine/core";
import { ActionType } from "power-shared";
import { RunAction } from "../useUnilog";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
}));
export interface Device {
  key: string;
  powered: boolean;
}

interface Props {
  device: Device;
  runAction: RunAction;
}

function AdminDevice({ device, runAction }: Props) {
  const { classes } = useStyles();
  return (
    <Group className={classes.container} position="apart">
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
    </Group>
  );
}

export default AdminDevice;
