import { Button, createStyles, Group, Stack, Text } from "@mantine/core";
import { ActionType, DeviceClassToggle } from "power-shared";
import { useState } from "react";
import { RunAction } from "../useUnilog";
import AdminCard from "./AdminCard";
import AdminDevice from "./AdminDevice";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
  title: { letterSpacing: 2, fontWeight: 700, color: theme.colors.primary1 },
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

  const onReset = () => setDraftPowered({});

  const anyToggleChanged = toggles.some(
    (toggle) =>
      draftPowered[toggle.key] !== undefined &&
      draftPowered[toggle.key] !== toggle.powered,
  );

  return (
    <AdminCard>
      <Stack p={0} className={classes.container}>
        <Text className={classes.title} size={30}>
          FILTERS
        </Text>
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
        <Group grow>
          <Button
            variant="outline"
            onClick={onApply}
            disabled={!anyToggleChanged}
          >
            APPLY
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            disabled={!anyToggleChanged}
          >
            RESET
          </Button>
        </Group>
      </Stack>
    </AdminCard>
  );
}

export default AdminDeviceList;
