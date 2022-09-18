import { Button, Center, createStyles, Group, Stack } from "@mantine/core";
import { ActionType, State } from "power-shared";
import { RunAction } from "../useUnilog";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { width: "100%", height: "100vh" },
}));

interface Props {
  runAction: RunAction;
  state: State;
}
function Event({ runAction, state }: Props) {
  const { classes } = useStyles();

  return (
    <Center className={classes.container}>
      <Stack spacing={0} align="center">
        <img
          src={"/Powerplant" + (state.eventOngoing ? "Broken" : "") + ".svg"}
          alt=""
          height={450}
        />
        <Group>
          {state.eventOngoing ? (
            <Button
              onClick={() =>
                runAction(() => {
                  return { type: ActionType.EndEvent };
                })
              }
            >
              End Event
            </Button>
          ) : (
            <Button
              onClick={() =>
                runAction(() => {
                  return { type: ActionType.StartEvent };
                })
              }
            >
              Start Event
            </Button>
          )}
        </Group>
      </Stack>
    </Center>
  );
}

export default Event;
