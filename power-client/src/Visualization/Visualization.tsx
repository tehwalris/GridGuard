import { createStyles } from "@mantine/core";
import { State } from "power-shared";
import useWindowDimensions from "./useWindowDimension";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    position: "relative",
    margin: 100,
  },
  item: {
    width: 5,
    height: 5,
    backgroundColor: "black",
    position: "absolute",
  },
}));

function gamma(d: number) {
  let x = 1.0;
  for (let i = 0; i < 20; i++)
    x = x - (Math.pow(x, d + 1) - x - 1) / ((d + 1) * Math.pow(x, d) - 1);
  return x;
}

const g = gamma(2);
const alpha = [Math.pow(1 / g, 1) % 1, Math.pow(1 / g, 2) % 1];

function Visualization({ state }: { state: State }) {
  const { classes } = useStyles();
  const { height, width } = useWindowDimensions();

  const types = [
    "oven",
    "heater",
    "dishwasher",
    "light",
    "microwave",
    "fridge",
  ];
  const devices = state.devices.map((device, i) => {
    return { ...device, coords: alpha.map((e) => (0.5 + e * (i + 1)) % 1) };
  });
  const n = devices.length;

  for (let i = 0; i < n; i++) {
    devices[i].coords = alpha.map((e) => (0.5 + e * (i + 1)) % 1);
  }
  return (
    <div className={classes.container}>
      {devices.map((device) => (
        <img
          height={40}
          src={
            "/" +
            device.deviceClassKey +
            (device.powerConsumption !== 0 ? "" : "Off") +
            ".svg"
          }
          alt=""
          style={{
            position: "absolute",
            top: device.coords![0] * (height - 240),
            left: device.coords![1] * (width - 240),
          }}
        />
      ))}
    </div>
  );
}

export default Visualization;
