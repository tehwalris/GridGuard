import { Button, createStyles, Stack, Text } from "@mantine/core";
import { ActionType, DeviceClassToggle } from "power-shared";
import { useState } from "react";
import { RunAction } from "../useUnilog";
import AdminCard from "./AdminCard";
import AdminDevice from "./AdminDevice";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
}));

interface Props {
  toggles: DeviceClassToggle[];
  runAction: RunAction;
}

function AdminDeviceList({ toggles, runAction }: Props) {
  const { classes } = useStyles();

  const [draftPowered, setDraftPowered] = useState<{ [key: string]: boolean }>(
    {},
  );

  const onApply = () => {
    for (const toggle of toggles) {
      if (draftPowered[toggle.key] !== undefined) {
        runAction(() => ({
          type: ActionType.SetToggle,
          key: toggle.key,
          powered: draftPowered[toggle.key],
        }));
      }
    }
    setDraftPowered({});
  };

  const anyToggleChanged = toggles.some(
    (toggle) =>
      draftPowered[toggle.key] !== undefined &&
      draftPowered[toggle.key] !== toggle.powered,
  );

  return (
    <AdminCard>
      <Stack p={0} className={classes.container}>
        <Text size={30}>Devices</Text>{" "}
        {toggles.map((toggle) => (
          <AdminDevice
            key={toggle.key}
            device={{
              ...toggle,
              powered: draftPowered[toggle.key] ?? toggle.powered,
            }}
            onPoweredChange={(v) =>
              setDraftPowered((old) => ({ ...old, [toggle.key]: v }))
            }
          />
        ))}
        <Button onClick={onApply} disabled={!anyToggleChanged}>
          Apply
        </Button>
      </Stack>
    </AdminCard>
  );
}

export default AdminDeviceList;
