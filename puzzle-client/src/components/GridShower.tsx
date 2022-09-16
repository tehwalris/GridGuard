/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React from "react";
import {
  GridLocation,
  GridPlacement,
  GridSize,
  RecentReceive,
} from "puzzle-shared";
import GridShowerCell from "./GridShowerCell";

interface Props {
  grid: GridPlacement;
  gridSize: GridSize;
  onClickCell?: (location: GridLocation, piece: number | null) => void;
  imageURL: string;
  tileHeight: number;
  tileWidth: number;
  highlightEmpty: boolean;
  recentReceives?: RecentReceive[];
  scale: number;
}

const styles = {
  table: css({
    borderSpacing: 0,
    outline: "1px solid black",
    tableLayout: "fixed",
    borderCollapse: "separate",
  }),
};

const GridShower: React.FC<Props> = ({
  grid,
  gridSize,
  onClickCell,
  imageURL,
  tileHeight,
  tileWidth,
  highlightEmpty,
  recentReceives,
  scale,
}) => {
  return (
    <div>
      <table css={styles.table}>
        <tbody>
          {grid.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <GridShowerCell
                  key={i * row.length + j}
                  containerHTMLTag="td"
                  onClick={() =>
                    onClickCell
                      ? onClickCell({ row: i, column: j }, cell)
                      : undefined
                  }
                  cell={cell}
                  highlightEmpty={highlightEmpty}
                  tileWidth={tileWidth}
                  tileHeight={tileHeight}
                  highlightRecent={
                    !!recentReceives?.find((el) => el.piece === cell)
                  }
                  imageURL={imageURL}
                  gridSize={gridSize}
                  scale={scale}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default GridShower;
