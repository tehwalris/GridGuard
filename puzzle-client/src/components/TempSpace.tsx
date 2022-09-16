import React, { useMemo } from "react";
import { GridSize, RecentReceive } from "puzzle-shared";
import GridShowerCell from "./GridShowerCell";

interface Props {
  grid: (number | null)[];
  gridSize: GridSize;
  onClickCell?: (index: number, piece: number | null) => void;
  imageURL: string;
  tileHeight: number;
  tileWidth: number;
  highlightEmpty: boolean;
  recentReceives?: RecentReceive[];
  containerHeight: number;
  containerWidth: number;
}

const cellPadding = 10;

interface ScaleFittingData {
  containerHeight: number;
  containerWidth: number;
  tileHeight: number;
  tileWidth: number;
  length: number;
}
const doesItFit = (
  {
    containerHeight,
    containerWidth,
    tileHeight,
    tileWidth,
    length,
  }: ScaleFittingData,
  scale: number,
) => {
  const nrOfTilesPerRow = Math.floor(
    containerWidth / (Math.ceil(tileWidth * scale) + 2 * cellPadding),
  );
  const nrOfRows = Math.ceil(length / nrOfTilesPerRow);
  const itFits =
    containerHeight >=
    nrOfRows * (Math.ceil(tileHeight * scale) + 2 * cellPadding);
  return itFits;
};

const computeTileScale = (data: ScaleFittingData) => {
  let low = 0;
  let high = 1000;
  let targetDifference = 0.01;
  while (high - low > targetDifference) {
    const newScale = 0.5 * (high + low);
    if (doesItFit(data, newScale)) {
      low = newScale;
    } else {
      high = newScale;
    }
  }

  return low;
};

// HACK Don't use emotion here for performance
const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    padding: cellPadding,
  } as React.CSSProperties,
  cell: { padding: cellPadding } as React.CSSProperties,
};

const TempSpace: React.FC<Props> = ({
  grid,
  gridSize,
  onClickCell,
  imageURL,
  tileHeight,
  tileWidth,
  highlightEmpty,
  recentReceives,
  containerHeight,
  containerWidth,
}) => {
  const scale = useMemo(
    () =>
      computeTileScale({
        containerHeight: containerHeight - 2 * cellPadding,
        containerWidth: containerWidth - 2 * cellPadding,
        tileHeight,
        tileWidth,
        length: grid.length,
      }),
    [containerHeight, containerWidth, grid.length, tileHeight, tileWidth],
  );

  return (
    <div style={styles.container}>
      {grid.map((cell, i) => (
        <div style={styles.cell} key={i}>
          <GridShowerCell
            containerHTMLTag="div"
            onClick={() => onClickCell?.(i, cell)}
            cell={cell}
            highlightEmpty={highlightEmpty}
            tileWidth={tileWidth}
            tileHeight={tileHeight}
            highlightRecent={!!recentReceives?.find((el) => el.piece === cell)}
            imageURL={imageURL}
            gridSize={gridSize}
            scale={scale}
          />
        </div>
      ))}
    </div>
  );
};
export default TempSpace;
