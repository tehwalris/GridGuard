import { createStyles, Grid } from "@mantine/core";
import { State } from "power-shared";
import React from "react";
import LineChart from "../components/LineChart";
import AdminDeviceList from "./AdminDeviceList";
import AdminBox from "./AdminBox";

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

function AdminContent({ state }: Props) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Grid grow gutter="lg">
        <Grid.Col className={classes.border} span={5} p={0}>
          <LineChart data={state.simulation.recentPowerConsumption} />
          <Grid grow gutter="sm">
            <Grid.Col span={1} p={0}>
              <AdminBox />
            </Grid.Col>
            <Grid.Col span={1} p={0}>
              <AdminBox />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col className={classes.border} span={1} p={0}>
          <AdminDeviceList devices={state.toggles} />
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default AdminContent;
