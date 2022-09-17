import { Text } from "@mantine/core";
import _ from "lodash";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from "victory";

interface Props {
  data: number[];
  title: string;
}

function LineChart({ data, title }: Props) {
  return (
    <div>
      <Text p="sm" size={30}>
        {title}
      </Text>
      <VictoryChart
        // domainPadding will add space to each side of VictoryBar to
        // prevent it from overlapping the axis
        domainPadding={20}
      >
        <VictoryAxis />
        <VictoryAxis
          label="Power"
          style={{
            axis: { stroke: "none" },
            axisLabel: { fontSize: 15, padding: 30 },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 10, padding: 5 },
          }}
          tickCount={3}
          dependentAxis
          domain={[0, _.max(data) ?? 0]}
        />
        <VictoryScatter
          size={5}
          style={{ data: { fill: "tomato" } }}
          data={data}
        />
        <VictoryLine data={data} />
      </VictoryChart>
    </div>
  );
}

export default LineChart;
