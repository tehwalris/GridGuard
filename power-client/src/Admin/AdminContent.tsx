import { createStyles, Grid } from "@mantine/core";
import { State } from "power-shared";
import React from "react";
import LineChart from "../components/LineChart";
import AdminDeviceList from "./AdminDeviceList";
import AdminBox from "./TextBox";
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
  runAction: RunAction;
}

function AdminContent({ state, runAction }: Props) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Grid grow gutter="lg">
        <Grid.Col className={classes.border} span={5} p={0}>
          <LineChart data={state.simulation.recentPowerConsumption} />
          <Grid grow gutter="sm">
            <Grid.Col span={1} p={0}>
              <AdminBox
                content={
                  "Current Usage: " +
                  state.simulation.recentPowerConsumption.slice(-1)[0]
                }
              />
            </Grid.Col>
            <Grid.Col span={1} p={0}>
              <AdminBox content="URGENT:" />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col className={classes.border} span={1} p={0}>
          <AdminDeviceList devices={state.toggles} runAction={runAction} />
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default AdminContent;
