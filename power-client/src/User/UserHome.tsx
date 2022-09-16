import { createStyles, Group, Stack } from "@mantine/core";
import { State } from "power-shared";
import LineChart from "../components/LineChart";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  border: { border: "1px solid black" },
}));

interface Props {
  state: State;
}

function UserContent({ state }: Props) {
  const { classes } = useStyles();

  const recentPowerConsumption = state.simulationHistory.map(
    (h) => h.powerConsumption,
  );

  return (
    <div className={classes.container}>
      <Stack>
        <LineChart data={recentPowerConsumption} />
        <div>POWER OUTAGE IMMINENT!</div>
        <Group grow>
          <div>A</div>
          <div>B</div>
        </Group>
      </Stack>
    </div>
  );
}

export default UserContent;
