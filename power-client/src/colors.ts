import { DefaultMantineColor } from "@mantine/core";

export const colors = {
  primary1: new Array(10).fill("#3c445b"),
  contrast1: new Array(10).fill("#f2f4fa"),
  contrast2: new Array(10).fill("#b3adbd"),
  green: new Array(10).fill("#7bae97"),
  red: new Array(10).fill("#be503a"),
  lightRed: new Array(10).fill("#fdf3f1"),
} as unknown as Partial<
  Record<
    DefaultMantineColor,
    [
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
      string,
    ]
  >
>;
