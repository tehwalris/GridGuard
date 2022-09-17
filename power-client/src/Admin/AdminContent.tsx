import { Box, createStyles, Grid } from "@mantine/core";
import { selectRecentLoad, State } from "power-shared";
import { colors } from "../colors";
import LineChart from "../components/LineChart";
import { RunAction } from "../useUnilog";
import AdminCard from "./AdminCard";
import AdminDeviceList from "./AdminDeviceList";
import AdminNumberCard from "./AdminNumberCard";

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

  const recentLoad = selectRecentLoad(state);
  const currentLoad = recentLoad.slice(-1)[0];

  return (
    <Box p="md" className={classes.container}>
      <Grid grow gutter="lg">
        <Grid.Col span={4} p={0}>
          <AdminCard>
            <LineChart
              predictedDifference={0.1}
              data={recentLoad}
              title="NETWORK LOAD"
            />
          </AdminCard>
          <Grid grow gutter="sm">
            <Grid.Col span={1} p={0}>
              <AdminNumberCard
                label={"Current Usage [MW] "}
                value={Math.round(
                  state.simulation.powerConsumption.total / 10e6,
                )}
              />
            </Grid.Col>
            <Grid.Col span={1} p={0}>
              <AdminNumberCard
                label="Adjustments required"
                backgroundColor={
                  currentLoad > 1.01 || currentLoad < 0.99
                    ? colors.lightRed![0]
                    : "white"
                }
                labelColor={
                  currentLoad > 1.01 || currentLoad < 0.99
                    ? colors.red![0]
                    : colors.primary1![0]
                }
                value={
                  currentLoad > 1.01 || currentLoad < 0.99 ? "URGENT" : "NO"
                }
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={1} p={0}>
          <AdminDeviceList toggles={state.toggles} runAction={runAction} />
        </Grid.Col>
      </Grid>
    </Box>
  );
}

export default AdminContent;
