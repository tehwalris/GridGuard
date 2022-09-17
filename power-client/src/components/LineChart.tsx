import { createStyles, Text } from "@mantine/core";
import _ from "lodash";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from "victory";
import { colors } from "../colors";

interface Props {
  data: number[];
  title: string;
}

const useStyles = createStyles((theme, _params, getRef) => ({
  title: {
    letterSpacing: 2,
    fontWeight: 700,
    color: theme.colors.primary1,
  },
}));

function LineChart({ data, title }: Props) {
  const { classes } = useStyles();
  return (
    <div>
      <Text className={classes.title} p="sm" size={30}>
        {title}
      </Text>
      <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
      >
        <VictoryAxis />
        <VictoryAxis
          label="Load"
          style={{
            axis: { stroke: "none" },
            axisLabel: { fontSize: 15, padding: 30 },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 10, padding: 5 },
          }}
          dependentAxis
          domain={
            data.length
              ? [Math.min(0.98, _.min(data)!), Math.max(1.02, _.max(data)!)]
              : undefined
          }
        />

        <VictoryLine data={data} />
        <VictoryScatter
          size={5}
          style={{ data: { fill: colors.red![0] } }}
          data={data}
        />
      </VictoryChart>
    </div>
  );
}

export default LineChart;
