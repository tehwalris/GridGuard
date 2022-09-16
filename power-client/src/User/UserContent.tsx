import { createStyles, Group, Stack } from "@mantine/core";
import { State } from "power-shared";
import React from "react";
import LineChart from "../components/LineChart";
import { RunAction } from "../useUnilog";

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

  return (
    <div className={classes.container}>
      <Stack>
        <LineChart data={state.simulation.recentPowerConsumption} />
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
