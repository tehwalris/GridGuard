import React from "react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryScatter,
} from "victory";

import { Text } from "@mantine/core";

const data = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 7 },
];
function LineChart() {
  return (
    <div style={{ border: "1px solid black" }}>
      <Text p="lg" size={30}>
        Title
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
            axisLabel: { fontSize: 20, padding: 30 },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 15, padding: 5 },
          }}
          tickCount={3}
          dependentAxis
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
