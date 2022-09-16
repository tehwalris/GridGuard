/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import {
  LayoutInput,
  LayoutOutput,
  LayoutRectangle,
  LayoutRectangleName,
} from "../layout";

interface Props {
  scalingFactor: number;
  layoutInput: LayoutInput;
  layoutOutput: LayoutOutput;
}

const styles = {
  outerContainer: (w: number, h: number) =>
    css({ width: w, height: h, outline: "1px solid black" }),
  innerContainer: (w: number, h: number, scalingFactor: number) =>
    css({
      width: w,
      height: h,
      transform: `scale(${scalingFactor})`,
      transformOrigin: "top left",
      position: "relative",
    }),
  rect: (layoutRect: LayoutRectangle, color: string) =>
    css({
      position: "absolute",
      top: layoutRect.top,
      left: layoutRect.left,
      width: layoutRect.width,
      height: layoutRect.height,
      background: color,
      opacity: 0.5,
    }),
};

function fitRect(
  outer: LayoutRectangle,
  aspect: { width: number; height: number },
): LayoutRectangle {
  const imageScale = Math.min(
    outer.width / aspect.width,
    outer.height / aspect.height,
  );

  const inner: LayoutRectangle = {
    top: 0,
    left: 0,
    width: imageScale * aspect.width,
    height: imageScale * aspect.height,
  };
  inner.top = (outer.height - inner.height) / 2 + outer.top;
  inner.left = (outer.width - inner.width) / 2 + outer.left;

  return inner;
}

export const MiniLayout: React.FC<Props> = ({
  scalingFactor,
  layoutInput,
  layoutOutput,
}) => {
  const solvingImageRect = fitRect(
    layoutOutput[LayoutRectangleName.Solving],
    layoutInput.image,
  );
  const boardImageRect = fitRect(
    layoutOutput[LayoutRectangleName.Board],
    layoutInput.image,
  );

  return (
    <div
      css={styles.outerContainer(
        scalingFactor * layoutInput.screen.width,
        scalingFactor * layoutInput.screen.height,
      )}
    >
      <div
        css={styles.innerContainer(
          layoutInput.screen.width,
          layoutInput.screen.height,
          scalingFactor,
        )}
      >
        <div
          css={styles.rect(layoutOutput[LayoutRectangleName.Solving], "red")}
        />
        <div css={styles.rect(solvingImageRect, "grey")} />
        <div
          css={styles.rect(layoutOutput[LayoutRectangleName.Board], "blue")}
        />
        <div css={styles.rect(boardImageRect, "grey")} />
        <div
          css={styles.rect(layoutOutput[LayoutRectangleName.Temp], "green")}
        />
        <div
          css={styles.rect(layoutOutput[LayoutRectangleName.Score], "purple")}
        />
      </div>
    </div>
  );
};
