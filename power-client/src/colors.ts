import { DefaultMantineColor } from "@mantine/core";

export const colors = {
  primary1: new Array(10).fill("#3F1D71"),
  contrast1: new Array(10).fill("#F3DCD6"),
  accent1: new Array(10).fill("#9E4A61"),
  primary2: new Array(10).fill("#8060B0"),
  accent2: new Array(10).fill("#7D646B"),
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
