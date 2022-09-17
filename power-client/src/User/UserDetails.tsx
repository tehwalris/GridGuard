import { Accordion, ActionIcon, createStyles, Group } from "@mantine/core";
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
      <Accordion>
        {user?.devices.map((device) => {
          const deviceState = selectDeviceSimulationState(state, device.id);
          return (
            <Accordion.Item value={device.id}>
              <Accordion.Control>
                <Group position="apart" className={classes.fullWidth}>
                  {device.deviceClassKey}
                  {!deviceState?.powered && (
                    <ActionIcon color="orange">
                      <IconInfoCircle />
                    </ActionIcon>
                  )}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                Colors, fonts, shadows and many other parts are customizable to
                fit your design needs
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
}

export default UserContent;
