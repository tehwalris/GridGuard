import { createStyles, Grid } from "@mantine/core";
import { State } from "power-shared";
import LineChart from "../components/LineChart";
import { RunAction } from "../useUnilog";
import AdminDeviceList from "./AdminDeviceList";
import AdminBox from "./TextBox";

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

  const recentPowerConsumption = state.simulationHistory.map(
    (h) => h.powerConsumption,
  );

  return (
    <div className={classes.container}>
      <Grid grow gutter="lg">
        <Grid.Col className={classes.border} span={5} p={0}>
          <LineChart data={recentPowerConsumption} />
          <Grid grow gutter="sm">
            <Grid.Col span={1} p={0}>
              <AdminBox
                content={"Current Usage: " + state.simulation.powerConsumption}
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
