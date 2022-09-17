import { Button, createStyles, Group, Stack, Text } from "@mantine/core";
import { ActionType, DeviceClassToggle } from "power-shared";
import { RunAction } from "../useUnilog";
import AdminCard from "./AdminCard";
import AdminDevice from "./AdminDevice";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
  title: { letterSpacing: 2, fontWeight: 800, color: theme.colors.primary1 },
}));

interface Props {
  toggles: DeviceClassToggle[];
  runAction: RunAction;
  draftPowered: { [key: string]: boolean };
  setDraftPowered: (smth: any) => void;
}

function AdminDeviceList({
  toggles,
  runAction,
  draftPowered,
  setDraftPowered,
}: Props) {
  const { classes } = useStyles();

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
              setDraftPowered((old: any) => ({ ...old, [toggle.key]: v }))
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
