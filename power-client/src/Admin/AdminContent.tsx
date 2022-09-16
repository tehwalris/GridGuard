import { createStyles, Grid } from "@mantine/core";
import React from "react";
import LineChart from "../components/LineChart";
import AdminDeviceList from "./AdminDeviceList";
import AdminNumberBox from "./AdminNumberBox";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
  },
  border: { border: "1px solid black" },
}));

function AdminContent() {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Grid grow gutter="lg">
        <Grid.Col className={classes.border} span={5} p={0}>
          <LineChart />
          <Grid grow gutter="sm">
            <Grid.Col span={1} p={0}>
              <AdminNumberBox />
            </Grid.Col>
            <Grid.Col span={1} p={0}>
              <AdminNumberBox />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col className={classes.border} span={1} p={0}>
          <AdminDeviceList />
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default AdminContent;
