import React, { Fragment } from "react";
import { GridPlacement, GridSize } from "puzzle-shared";

interface Props {
  grid: GridPlacement;
  size: GridSize;
  tileWidth: number;
  tileHeight: number;
}

interface TdProps {
  tileWidth: number;
  tileHeight: number;
  filled: boolean;
}

// HACK Don't use emotion here for performance
const styles = {
  table: {
    tableLayout: "fixed",
    borderSpacing: "3px",
    borderCollapse: "separate",
  } as React.CSSProperties,
  tdSpacing: {
    width: "4px",
    height: "4px",
  } as React.CSSProperties,
  td: ({ tileWidth, tileHeight, filled }: TdProps): React.CSSProperties => ({
    border: "1px solid black",
    boxSizing: "border-box",
    padding: "0px",
    background: filled ? "black" : undefined,
    width: tileWidth,
    height: tileHeight,
  }),
};

const ProgressGrid = React.memo(
  ({ grid, size, tileWidth, tileHeight }: Props) => {
    return (
      <div>
        <table style={styles.table}>
          <tbody>
            {grid.map((row, i) => (
              <Fragment key={i}>
                {i === size.height / 2 ? (
                  <tr>
                    <td style={styles.tdSpacing} />
                  </tr>
                ) : undefined}
                <tr>
                  {row.map((cell, j) => (
                    <Fragment key={j}>
                      {j === size.width / 2 ? (
                        <td style={styles.tdSpacing} />
                      ) : undefined}
                      <td
                        style={styles.td({
                          filled: cell != null,
                          tileWidth,
                          tileHeight,
                        })}
                      />
                    </Fragment>
                  ))}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

export default ProgressGrid;
