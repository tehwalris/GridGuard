import React from "react";

interface Props {
  display: boolean;
  offsetTop: number;
  offsetLeft: number;
  imageURL: string;
  scale: number;
  imageWidth: number;
  imageHeight: number;
  tileWidth: number;
  tileHeight: number;
}

// HACK Don't use emotion here for performance
const styles = {
  imageSection: ({
    scale,
    tileHeight,
    tileWidth,
    imageWidth,
    imageHeight,
    imageURL,
    offsetLeft,
    offsetTop,
    display,
  }: Props): React.CSSProperties => ({
    width: Math.floor(scale * tileWidth),
    height: Math.floor(scale * tileHeight),
    backgroundSize:
      scale * imageWidth +
      "px " +
      scale * imageHeight +
      "px, " +
      scale * imageWidth +
      "px " +
      scale * imageHeight +
      "px",
    backgroundImage: display
      ? `url("https://i.imgur.com/cywAiub.png"), url("${imageURL}")`
      : undefined,
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundPosition:
      -scale * offsetLeft +
      "px " +
      -scale * offsetTop +
      "px, " +
      -scale * offsetLeft +
      "px " +
      -scale * offsetTop +
      "px",
  }),
};

const ImageSection = React.memo((props: Props) => {
  return <div style={styles.imageSection(props)} />;
});

export default ImageSection;
