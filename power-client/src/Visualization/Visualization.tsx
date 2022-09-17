import { createStyles } from "@mantine/core";
import { State } from "power-shared";
import useWindowDimensions from "./useWindowDimension";

const itemSize = 40;

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    overflow: "hidden",
    width: "100vw",
    height: "100vh",
  },
  item: {
    width: itemSize,
    height: itemSize,
    backgroundColor: "black",
    position: "fixed",
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
  const padding = -10;

  const area =
    Math.max(0, width - 2 * padding) * Math.max(0, height - 2 * padding);

  const devices = state.devices
    .slice(0, Math.floor((50 * area) / 297228))
    .map((device, i) => {
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
          key={device.id}
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
            top:
              device.coords![0] * (height - 2 * padding) +
              padding -
              itemSize / 2,
            left:
              device.coords![1] * (width - 2 * padding) +
              padding -
              itemSize / 2,
            opacity: device.powerConsumption !== 0 ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

export default Visualization;
