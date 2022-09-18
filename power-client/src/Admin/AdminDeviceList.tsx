import {
  Button,
  createStyles,
  Divider,
  Group,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { ActionType, DeviceClassToggle } from "power-shared";
import { useEffect } from "react";
import { RunAction } from "../useUnilog";
import AdminCard from "./AdminCard";
import AdminDevice from "./AdminDevice";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { height: "100%", width: "100%" },
  title: { letterSpacing: 2, fontWeight: 800, color: theme.colors.primary1 },
  addSeparator: {
    ":after": {
      content: "''",
      background: theme.colors.contrast2[0],
      width: "100%",
      height: 1,
      display: "block",
      marginTop: 15,
    },
  },
}));

interface Props {
  toggles: DeviceClassToggle[];
  runAction: RunAction;
  draftTargetSavingRatios: { [key: string]: number | undefined };
  setDraftTargetSavingRatios: (
    updateTargetSavingRatios:
      | { [key: string]: number | undefined }
      | ((oldTargetSavingRatios: { [key: string]: number | undefined }) => {
          [key: string]: number | undefined;
        }),
  ) => void;
  autoAdjust: boolean;
  setAutoAdjust: (v: boolean) => void;
}

function AdminDeviceList({
  toggles,
  runAction,
  draftTargetSavingRatios,
  setDraftTargetSavingRatios,
  autoAdjust,
  setAutoAdjust,
}: Props) {
  const { classes } = useStyles();

  const onApply = () => {
    for (const toggle of toggles) {
      const targetSavingRatio = draftTargetSavingRatios[toggle.key];
      if (targetSavingRatio !== undefined) {
        runAction(() => ({
          type: ActionType.SetToggle,
          key: toggle.key,
          targetSavingRatio,
        }));
      }
    }
    setDraftTargetSavingRatios({});
  };

  const onReset = () => setDraftTargetSavingRatios({});

  const anyToggleChanged = toggles.some(
    (toggle) =>
      draftTargetSavingRatios[toggle.key] !== undefined &&
      draftTargetSavingRatios[toggle.key] !== toggle.targetSavingRatio,
  );

  useEffect(() => {
    setDraftTargetSavingRatios({});
  }, [autoAdjust, setDraftTargetSavingRatios]);

  return (
    <AdminCard>
      <Stack p={0} className={classes.container}>
        <Text className={classes.title} size={26} pl={12}>
          LIMITS
        </Text>
        <Group position="apart">
          <Text>Auto-adjust limits if necessary</Text>
          <Switch
            checked={autoAdjust}
            onChange={(ev) => setAutoAdjust(ev.currentTarget.checked)}
          />
        </Group>
        <Divider />
        {toggles.map((toggle) => (
          <div className={classes.addSeparator}>
            <AdminDevice
              key={toggle.key}
              device={
                autoAdjust
                  ? toggle
                  : {
                      ...toggle,
                      targetSavingRatio:
                        draftTargetSavingRatios[toggle.key] ??
                        toggle.targetSavingRatio,
                    }
              }
              onTargetSavingsRatioChange={(v) =>
                setDraftTargetSavingRatios((old) => ({
                  ...old,
                  [toggle.key]: v,
                }))
              }
              autoAdjust={autoAdjust}
            />
          </div>
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
