import { DistributionTime, GridSize, NumberOfTiles } from "./interfaces/state";

export const numberOfPiecesBounds: {
  [key in NumberOfTiles]: { low: number; high: number };
} = {
  [NumberOfTiles.Few]: { low: 60, high: 80 },
  [NumberOfTiles.Medium]: { low: 80, high: 120 },
  [NumberOfTiles.Many]: { low: 120, high: 200 },
};
export const distributionTimes: {
  [key in DistributionTime]: { low: number; high: number };
} = {
  [DistributionTime.Short]: { low: 3, high: 5 },
  [DistributionTime.Medium]: { low: 5, high: 15 },
  [DistributionTime.Long]: { low: 10, high: 60 },
};
export const tempSpaceSizes: {
  [key in NumberOfTiles]: GridSize;
} = {
  [NumberOfTiles.Few]: { width: 8, height: 4 },
  [NumberOfTiles.Medium]: { width: 10, height: 5 },
  [NumberOfTiles.Many]: { width: 12, height: 6 },
};
