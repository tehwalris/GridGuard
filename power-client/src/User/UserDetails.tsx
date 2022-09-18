import {
  Accordion,
  ActionIcon,
  createStyles,
  Group,
  Text,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons";
import {
  selectDeviceSimulationState,
  selectUserDevices,
  State,
} from "power-shared";

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
    fontWeight: 800,
  },
}));

interface Props {
  state: State;
  userId: string;
}

function UserContent({ state, userId }: Props) {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <Text className={classes.title} p="sm">
        YOUR DEVICES
      </Text>
      <Accordion>
        {selectUserDevices(state, userId).map((device) => {
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
                  {(deviceState?.deviceAffected && (
                    <ActionIcon color="orange">
                      <IconInfoCircle />
                    </ActionIcon>
                  )) ||
                    (deviceState?.deviceClassAffected && (
                      <ActionIcon color="blue">
                        <IconInfoCircle />
                      </ActionIcon>
                    ))}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {(deviceState?.deviceAffected && (
                  <div>
                    To help prevent an immediate black-out, we have temporarily
                    disabled some {niceDeviceType.toLowerCase()}s, including
                    yours. We expect the situation to stabilize shortly and
                    thank you for your cooperation!
                  </div>
                )) ||
                  (deviceState?.deviceClassAffected && (
                    <div>
                      Your {niceDeviceType.toLowerCase()} is currently running
                      normally, but some others {niceDeviceType.toLowerCase()}s
                      have been temporarily disabled to stabilize the grid.
                    </div>
                  )) || (
                    <div>
                      All {niceDeviceType.toLowerCase()}s are currently running
                      normally!
                    </div>
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
