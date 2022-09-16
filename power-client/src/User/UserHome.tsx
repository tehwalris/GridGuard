import { Center, createStyles, Group, Stack } from "@mantine/core";
import { State } from "power-shared";
import { Link } from "react-router-dom";
import LineChart from "../components/LineChart";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  border: { border: "1px solid black" },
  imminent: { width: "100%", height: 60, border: "1px solid black" },
  box: { height: 90, border: "1px solid black" },
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
        <Center className={classes.imminent}>POWER OUTAGE IMMINENT!</Center>
        <Group position="center" grow>
          <Center className={classes.box}>Power saved: 1</Center>
          <Link to="/user/details">
            <Center className={classes.box}>Devices affected: 1</Center>
          </Link>
        </Group>
      </Stack>
    </div>
  );
}

export default UserContent;
