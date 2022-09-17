import { Button, Center, createStyles, Group, Stack } from "@mantine/core";
import { ActionType } from "power-shared";
import { RunAction } from "../useUnilog";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: { width: "100%", height: "100vh" },
}));

interface Props {
  runAction: RunAction;
}
function Event({ runAction }: Props) {
  const { classes } = useStyles();

  return (
    <Center className={classes.container}>
      <Stack spacing={50}>
        <img src={"/fridge.svg"} alt="" height={250} />
        <Group>
          <Button
            onClick={() =>
              runAction(() => {
                return { type: ActionType.StartEvent };
              })
            }
          >
            Start Event
          </Button>
          <Button
            onClick={() =>
              runAction(() => {
                return { type: ActionType.EndEvent };
              })
            }
          >
            End Event
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}

export default Event;
