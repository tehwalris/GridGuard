import React from "react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryScatter,
} from "victory";

const data = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 7 },
];
function LineChart() {
  return (
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
  );
}

export default LineChart;
