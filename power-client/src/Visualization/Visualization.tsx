import { createStyles } from "@mantine/core";
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

const types = ["oven", "heater", "dishwasher", "light", "microwave", "fridge"];
const devices: { type: string; coords: any; onOff: boolean }[] = [];
for (let i = 0; i < 80; i++) {
  devices.push({
    type: types[Math.floor(Math.random() * types.length)],
    coords: [],
    onOff: Math.random() > 0.5,
  });
}

function gamma(d: number) {
  let x = 1.0;
  for (let i = 0; i < 20; i++)
    x = x - (Math.pow(x, d + 1) - x - 1) / ((d + 1) * Math.pow(x, d) - 1);
  return x;
}

const d = 2;
const n = devices.length;

const g = gamma(d);
const alpha = [Math.pow(1 / g, 1) % 1, Math.pow(1 / g, 2) % 1];
for (let i = 0; i < n; i++) {
  devices[i].coords = alpha.map((e) => (0.5 + e * (i + 1)) % 1);
}

function UserCard() {
  const { classes } = useStyles();
  const { height, width } = useWindowDimensions();

  return (
    <div className={classes.container}>
      {devices.map((device) => (
        <img
          height={40}
          src={"/" + device.type + (device.onOff ? "" : "Off") + ".svg"}
          alt=""
          style={{
            position: "absolute",
            top: device.coords[0] * (height - 240),
            left: device.coords[1] * (width - 240),
          }}
        />
      ))}
    </div>
  );
}

export default UserCard;
