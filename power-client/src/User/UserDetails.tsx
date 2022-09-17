import {
  Accordion,
  ActionIcon,
  createStyles,
  Group,
  Text,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons";
import { selectDeviceSimulationState, selectUser, State } from "power-shared";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  fullWidth: { width: "100%" },
  border: { border: "1px solid black" },
  warning: { backgroundColor: "#FFD8A8" },
  title: {
    fontSize: 20,
    color: theme.colors.primary1,
    letterSpacing: 2,
    fontWeight: 700,
  },
}));

interface Props {
  state: State;
  userId: string;
}

function UserContent({ state, userId }: Props) {
  const { classes } = useStyles();
  const user = selectUser(state, userId);
  return (
    <div className={classes.container}>
      <Text className={classes.title} p="sm">
        YOUR DEVICES
      </Text>
      <Accordion>
        {user?.devices.map((device) => {
          const deviceState = selectDeviceSimulationState(state, device.id);
          const niceDeviceType =
            device.deviceClassKey.charAt(0).toUpperCase() +
            device.deviceClassKey.slice(1);
          return (
            <Accordion.Item value={device.id}>
              <Accordion.Control>
                <Group position="apart" className={classes.fullWidth}>
                  <Group>
                    <img
                      height={24}
                      src={"/" + device.deviceClassKey + ".svg"}
                      alt=""
                    />
                    <div>{niceDeviceType}</div>
                  </Group>
                  {!deviceState?.powered && (
                    <ActionIcon color="orange">
                      <IconInfoCircle />
                    </ActionIcon>
                  )}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {!deviceState?.powered ? (
                  <div>
                    To help prevent an immediate black-out, we have temporarily
                    disabled all {niceDeviceType}s. We expect the situation to
                    stabilize shortly and thank you for your cooperation!
                  </div>
                ) : (
                  <div>{niceDeviceType}s are currently running normally!</div>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
}

export default UserContent;
