import { createStyles, Text } from "@mantine/core";
import _ from "lodash";
import { VictoryAxis, VictoryChart, VictoryLine } from "victory";
import { colors } from "../colors";

interface Props {
  data: number[];
  title: string;
  predictedDifference?: number;
  simple?: boolean;
}

const useStyles = createStyles((theme, _params, getRef) => ({
  title: {
    letterSpacing: 2,
    fontWeight: 700,
    color: theme.colors.primary1,
  },
}));

function CustomClip({ ...props }) {
  return (
    <defs key={"clips"}>
      <clipPath id="clip-path-1">
        <rect x={"0"} y={0} width={"100%"} height={props.scale.y(0.99)} />
      </clipPath>
      <clipPath id={"clip-path-2"}>
        <rect
          x={"0"}
          y={props.scale.y(1.01)}
          width={"100%"}
          height={props.scale.y(0.99) - props.scale.y(1.01)}
        />
      </clipPath>
    </defs>
  );
}

function LineChart({
  data,
  title,
  predictedDifference = 0,
  simple = false,
}: Props) {
  const { classes } = useStyles();

  const predictedData = data.map((v, i) => {
    const fractionProgress = i / data.length;
    return (
      v - predictedDifference / (1 + Math.exp(-10 * (fractionProgress - 0.5)))
    );
  });

  return (
    <div>
      <Text className={classes.title} p="sm" size={30}>
        {title}
      </Text>
      <VictoryChart domainPadding={20} height={260}>
        <VictoryAxis />
        <VictoryAxis
          label={simple ? "" : "Load"}
          style={{
            axis: { stroke: "none" },
            axisLabel: { fontSize: 15, padding: 30 },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 10, padding: 5 },
          }}
          dependentAxis
          tickFormat={simple ? (t) => t.toFixed(1) : undefined}
          tickValues={simple ? [1.0] : undefined}
          domain={
            data.length
              ? [Math.min(0.98, _.min(data)!), Math.max(1.02, _.max(data)!)]
              : undefined
          }
        />
        <VictoryLine
          interpolation="basis"
          style={{
            data: {
              stroke: colors.green![0],
              strokeDasharray: "8, 4",
              strokeWidth: 1,
            },
          }}
          data={new Array(data.length).fill(1)}
        />
        <VictoryLine
          interpolation="basis"
          style={{
            data: {
              stroke: colors.contrast2![0],
              strokeDasharray: "8, 4",
              strokeWidth: 4,
            },
          }}
          data={predictedData}
        />
        <VictoryLine
          interpolation="basis"
          style={{
            data: {
              stroke: colors.red![0],
              strokeWidth: 4,
            },
          }}
          data={data}
        />
        <VictoryLine
          interpolation="basis"
          style={{
            data: {
              stroke: colors.green![0],
              strokeWidth: 4,

              clipPath: "url(#clip-path-2)",
            },
          }}
          data={data}
        />
        <CustomClip />
        {/*<VictoryScatter
          size={5}
          style={{
            data: {
              fill: ({ datum }) => datum.fill,
            },
          }}
          data={coloredData}
        />*/}
      </VictoryChart>
    </div>
  );
}

export default LineChart;
