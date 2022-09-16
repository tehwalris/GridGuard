import React, { Fragment } from "react";
import { GridSize } from "puzzle-shared";
import ImageSection from "./ImageSection";

interface Props {
  cell: number | null;
  gridSize: GridSize;
  onClick?: () => void;
  imageURL: string;
  tileHeight: number;
  tileWidth: number;
  highlightEmpty?: boolean;
  highlightRecent: boolean;
  scale: number;
  containerHTMLTag: "td" | "div";
}

// HACK Don't use emotion here for performance
const styles = {
  td: (
    tileWidth: number,
    tileHeight: number,
    highlightRecent: boolean,
    highlightEmpty?: boolean,
  ): React.CSSProperties => ({
    position: "relative",
    padding: "0",
    minWidth: tileWidth + "px",
    minHeight: tileHeight + "px",
    width: tileWidth + "px",
    height: tileHeight + "px",
    background: highlightEmpty ? "#48aff0" : undefined,
    opacity: highlightEmpty ? 0.5 : undefined,
    outline: highlightRecent ? "5px solid orange" : undefined,
  }),
  borderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    border: "1px solid black",
    pointerEvents: "none",
  } as React.CSSProperties,
};

const GridShowerCell: React.FC<Props> = ({
  cell,
  gridSize,
  onClick,
  imageURL,
  tileHeight,
  tileWidth,
  highlightEmpty,
  highlightRecent,
  scale,
  containerHTMLTag,
}) => {
  return React.createElement(
    containerHTMLTag,
    {
      onClick,
      style: styles.td(
        Math.floor(tileWidth * scale),
        Math.floor(tileHeight * scale),
        highlightRecent,
        highlightEmpty,
      ),
    },
    <Fragment>
      <ImageSection
        display={cell != null}
        imageURL={imageURL}
        tileWidth={tileWidth}
        tileHeight={tileHeight}
        offsetLeft={(cell! % gridSize.width) * tileWidth}
        offsetTop={Math.floor(cell! / gridSize.width) * tileHeight}
        scale={scale}
        imageWidth={tileWidth * gridSize.width}
        imageHeight={tileHeight * gridSize.height}
      />
      <div style={styles.borderOverlay} />
    </Fragment>,
  );
};
export default GridShowerCell;
