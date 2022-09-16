import * as R from "ramda";
import { GridSize, GridLocation } from ".";
import { GridPlacement } from "./interfaces/state";

export const sizeWordsByLocation = {
  row: "height",
  column: "width",
} as const;

export function getAllPieceLocations(globalSize: GridSize): GridLocation[] {
  const locationsInGrid = R.times(
    (row) => R.times((column) => ({ row, column }), globalSize.width),
    globalSize.height,
  );
  return R.flatten(locationsInGrid);
}

// Does not modify the input placement.
// Throws if there is not enough free space.
// Throws if some of the elements to place are already placed.
export function placePiecesWhereEmpty(
  oldPlacement: GridPlacement,
  piecesToPlace: number[],
): GridPlacement {
  const piecesToPlaceSet = new Set(piecesToPlace);
  if (piecesToPlaceSet.size != piecesToPlace.length) {
    throw new Error("piecesToPlace contains duplicates");
  }

  const newPlacement = R.clone(oldPlacement);
  let i = 0;
  for (const newRow of newPlacement) {
    for (let j = 0; j < newRow.length; j++) {
      const oldPiece = newRow[j];
      if (oldPiece === null && i < piecesToPlace.length) {
        newRow[j] = piecesToPlace[i];
        i++;
      } else if (oldPiece !== null && piecesToPlaceSet.has(oldPiece)) {
        throw new Error(`piece to place already exists in grid: ${oldPiece}`);
      }
    }
  }
  if (i != piecesToPlace.length) {
    throw new Error("not enough space to place all pieces");
  }
  return newPlacement;
}

export function isValidGridCoordinate(v: number): boolean {
  return Number.isSafeInteger(v) && v >= 0;
}

export function inferGridSize(grid: unknown[][]): GridSize {
  if (!grid.length) {
    return { height: 0, width: 0 };
  }
  return { height: grid.length, width: grid[0].length };
}

export function assertLocationIsInGrid(
  gridSize: GridSize,
  location: GridLocation,
) {
  for (const dim of ["row", "column"] as const) {
    if (
      !isValidGridCoordinate(location[dim]) ||
      location[dim] >= gridSize[sizeWordsByLocation[dim]]
    ) {
      throw new Error(`localRange has invalid ${dim}`);
    }
  }
}

// **Modifies** the input placement.
// Returns the piece that was previously at the requested location.
// Throws if the location is out of bounds.
export function replacePieceAtLocation(
  grid: GridPlacement,
  location: GridLocation,
  piece: number,
): number | null {
  assertLocationIsInGrid(inferGridSize(grid), location);
  const oldPiece = grid[location.row][location.column];
  grid[location.row][location.column] = piece;
  return oldPiece;
}
