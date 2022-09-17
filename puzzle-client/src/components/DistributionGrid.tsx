import { GridSize } from "puzzle-shared";
import React, { useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";
import GridShowerCell from "./GridShowerCell";

interface Props {
  grid: (number | null)[];
  gridSize: GridSize;
  imageURL: string;
  tileHeight: number;
  tileWidth: number;
}

const cellPadding = 5;

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
    width: "100%",
    maxWidth: "800px",
    height: "100%",
    overflow: "hidden",
    alignContent: "flex-start",
    padding: cellPadding,
  } as React.CSSProperties,
  cell: { padding: cellPadding } as React.CSSProperties,
};

const DistributionGrid: React.FC<Props> = ({
  grid,
  gridSize,
  imageURL,
  tileHeight,
  tileWidth,
}) => {
  const {
    width,
    height,
    ref: containerRef,
  } = useResizeDetector<HTMLDivElement>();
  const scale = useMemo(() => {
    if (width === undefined || height === undefined) {
      return undefined;
    }
    return computeTileScale({
      containerHeight: height - 2 * cellPadding,
      containerWidth: width - 2 * cellPadding,
      tileHeight,
      tileWidth,
      length: grid.length,
    });
  }, [grid.length, tileHeight, tileWidth, width, height]);

  if (!scale) {
    return <div ref={containerRef} style={styles.container}></div>;
  }

  return (
    <div style={styles.container} ref={containerRef}>
      {grid.map((cell, i) => (
        <div style={styles.cell} key={i}>
          <GridShowerCell
            containerHTMLTag="div"
            cell={cell}
            tileWidth={tileWidth}
            tileHeight={tileHeight}
            highlightRecent={false}
            imageURL={imageURL}
            gridSize={gridSize}
            scale={scale}
          />
        </div>
      ))}
    </div>
  );
};
export default DistributionGrid;
