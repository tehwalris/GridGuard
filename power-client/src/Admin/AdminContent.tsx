import { Box, createStyles, Grid } from "@mantine/core";
import { State } from "power-shared";
import LineChart from "../components/LineChart";
import { RunAction } from "../useUnilog";
import AdminCard from "./AdminCard";
import AdminDeviceList from "./AdminDeviceList";
import AdminBox from "./TextBox";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.contrast1,
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
    <Box p="md" className={classes.container}>
      <Grid grow gutter="lg">
        <Grid.Col span={5} p={0}>
          <AdminCard>
            <LineChart data={recentPowerConsumption} title="Network Load" />
          </AdminCard>
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
        <Grid.Col span={1} p={0}>
          <AdminDeviceList devices={state.toggles} runAction={runAction} />
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default AdminContent;
