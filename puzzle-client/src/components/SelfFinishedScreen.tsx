/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { SolvingState, State } from "puzzle-shared";
import GridShower from "./GridShower";
import React, { useContext, useEffect, useState } from "react";
import TimeContext from "../timeContext";
import PostGameWrapper from "./PostGameWrapper";
import { useResizeDetector } from "react-resize-detector";

const styles = {
  gridContainer: css({
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
};
interface Props {
  state: State & { phaseState: SolvingState };
}

const SelfFinishedScreen: React.FC<Props> = ({ state }) => {
  const ts = useContext(TimeContext);

  const [time, setTime] = useState(ts.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(ts.now());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [ts]);
  const {
    width,
    height,
    ref: containerRef,
  } = useResizeDetector<HTMLDivElement>();

  const makeWrapper = (children: React.ReactNode) => (
    <PostGameWrapper
      timeInSeconds={(time - state.phaseState.startTime) / 1000}
      swaps={state.phaseState.numberOfSwaps}
    >
      <div css={styles.gridContainer} ref={containerRef}>
        {children}
      </div>
    </PostGameWrapper>
  );

  if (height === undefined || width === undefined) {
    return makeWrapper(null);
  }
  return makeWrapper(
    <GridShower
      grid={state.solution.pieces}
      gridSize={state.puzzleDefinition.size}
      imageURL={state.puzzleDefinition.imageURL}
      onClickCell={() => undefined}
      tileHeight={state.puzzleDefinition.tileHeight}
      tileWidth={state.puzzleDefinition.tileWidth}
      highlightEmpty={false}
      scale={Math.min(
        height / state.gameSettings.image.height,
        width / state.gameSettings.image.width,
      )}
    />,
  );
};

export default SelfFinishedScreen;
