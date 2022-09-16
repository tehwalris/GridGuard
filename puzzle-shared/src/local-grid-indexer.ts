import {
  assertLocationIsInGrid,
  inferGridSize,
  isValidGridCoordinate,
  sizeWordsByLocation,
} from "./grid-utils";
import { GridLocation, GridLocationRange, GridSize } from "./interfaces/state";

function isInRange(location: GridLocation, range: GridLocationRange) {
  return (["row", "column"] as const).every(
    (dim) => location[dim] >= range.from[dim] && location[dim] <= range.to[dim],
  );
}

function assertGlobalSizeValid(
  globalSize: GridSize,
  extraCheck: (v: number) => boolean = () => true,
) {
  if (
    ![globalSize.width, globalSize.height].every(
      (v) => isValidGridCoordinate(v) && v >= 0 && extraCheck(v),
    )
  ) {
    throw new Error("invalid globalSize");
  }
}

export class LocalGridIndexer {
  constructor(
    private readonly globalSize: GridSize,
    public readonly localRange: GridLocationRange, // must be valid indices in globalSize
  ) {
    assertGlobalSizeValid(globalSize);
    for (const dim of ["row", "column"] as const) {
      for (const v of [localRange.from[dim], localRange.to[dim]]) {
        if (
          !isValidGridCoordinate(v) ||
          v >= globalSize[sizeWordsByLocation[dim]]
        ) {
          throw new Error(`localRange has invalid ${dim}`);
        }
      }
    }
  }

  static forPlayer(globalSize: GridSize, player: number): LocalGridIndexer {
    assertGlobalSizeValid(globalSize, (v) => v % 2 == 0);
    if (player === 0) {
      return new LocalGridIndexer(globalSize, {
        from: { row: 0, column: 0 },
        to: {
          row: globalSize.height / 2 - 1,
          column: globalSize.width / 2 - 1,
        },
      });
    } else if (player === 1) {
      return new LocalGridIndexer(globalSize, {
        from: { row: 0, column: globalSize.width / 2 },
        to: {
          row: globalSize.height / 2 - 1,
          column: globalSize.width - 1,
        },
      });
    } else if (player === 2) {
      return new LocalGridIndexer(globalSize, {
        from: { row: globalSize.height / 2, column: 0 },
        to: {
          row: globalSize.height - 1,
          column: globalSize.width / 2 - 1,
        },
      });
    } else if (player === 3) {
      return new LocalGridIndexer(globalSize, {
        from: {
          row: globalSize.height / 2,
          column: globalSize.width / 2,
        },
        to: {
          row: globalSize.height - 1,
          column: globalSize.width - 1,
        },
      });
    } else {
      throw new Error(`player ${player} is out of range`);
    }
  }

  globalToLocal(global: GridLocation): GridLocation | undefined {
    if (!isInRange(global, this.localRange)) {
      return undefined;
    }
    return {
      row: global.row - this.localRange.from.row,
      column: global.column - this.localRange.from.column,
    };
  }

  localToGlobal(local: GridLocation): GridLocation {
    const global = {
      row: this.localRange.from.row + local.row,
      column: this.localRange.from.column + local.column,
    };
    if (!isInRange(global, this.localRange)) {
      throw new Error("point is not in localRange");
    }
    return global;
  }

  getAtLocal<T>(globalData: T[][], localLocation: GridLocation): T {
    const global = this.localToGlobal(localLocation);
    assertLocationIsInGrid(inferGridSize(globalData), global);
    return globalData[global.row][global.column];
  }

  setAtLocal<T>(
    globalData: T[][],
    localLocation: GridLocation,
    value: T,
  ): void {
    const global = this.localToGlobal(localLocation);
    assertLocationIsInGrid(inferGridSize(globalData), global);
    globalData[global.row][global.column] = value;
  }

  extractLocal<T>(globalData: T[][]): T[][] {
    return globalData
      .map((globalRowData, row) =>
        globalRowData.filter((v, column) =>
          this.globalToLocal({ row, column }),
        ),
      )
      .filter((row) => row.length);
  }
}
