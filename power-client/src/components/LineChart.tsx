import { createStyles, Text } from "@mantine/core";
import _ from "lodash";
import { VictoryAxis, VictoryChart, VictoryLine } from "victory";
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
