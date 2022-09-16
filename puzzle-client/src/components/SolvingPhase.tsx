/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useCallback, useMemo, useState } from "react";
import {
  ActionType,
  GridLocation,
  GridName,
  LocalGridIndexer,
  MoveDestinationType,
  SolvingState,
  State,
} from "puzzle-shared";
import { useResizeDetector } from "react-resize-detector";
import { computeLayout, LayoutRectangle, LayoutRectangleName } from "../layout";
import { RunAction } from "../useUnilog";
import GridShower from "./GridShower";
import ProgressGrid from "./ProgressGrid";
import TempSpace from "./TempSpace";
import PlayerGiver from "./PlayerGiver";
import SolvingScore from "./SolvingScore";

interface Props {
  state: State & { phaseState: SolvingState };
  myPlayerNumber: number;
  runAction: RunAction;
}

const SOLVING_GRID_PADDING_PX = 15;
const PROGRESS_GRID_PADDING_PX = 15;

const styles = {
  container: css({
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
  }),
  rect: (layoutRect: LayoutRectangle, color: string) =>
    css({
      position: "absolute",
      top: layoutRect.top,
      left: layoutRect.left,
      width: layoutRect.width,
      height: layoutRect.height,
      background: color,
    }),
  solvingGrid: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    height: "100%",
  }),
  progressArea: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    boxSizing: "border-box",
  }),
  playerGiverWrapper: css({
    position: "relative",
  }),
};

export const SolvingPhase: React.FC<Props> = ({
  state,
  myPlayerNumber,
  runAction,
}) => {
  const {
    width,
    height,
    ref: containerRef,
  } = useResizeDetector<HTMLDivElement>();

  const layoutOutput = useMemo(() => {
    if (width === undefined || height === undefined) {
      return undefined;
    }
    return computeLayout({
      screen: { width, height },
      image: {
        width: state.gameSettings.image.width,
        height: state.gameSettings.image.height,
      },
    });
  }, [
    width,
    height,
    state.gameSettings.image.width,
    state.gameSettings.image.height,
  ]);

  const [movingPiece, setMovingPiece] = useState<number | undefined>();

  const indexer = LocalGridIndexer.forPlayer(
    state.puzzleDefinition.size,
    myPlayerNumber,
  );
  const solutionGrid = indexer.extractLocal(state.solution.pieces);
  const playerNames = state.players.map((player) => player.name);

  const onClickCell = useCallback(
    (grid: GridName) => (location: GridLocation, piece: number | null) => {
      if (typeof movingPiece === "number") {
        if (grid === GridName.Main) {
          location = indexer.localToGlobal(location);
        }
        runAction((userId) => ({
          type: ActionType.PlacePiece,
          userId,
          piece: movingPiece,
          target: {
            type: MoveDestinationType.Grid,
            grid,
            location,
          },
        }));
        setMovingPiece(undefined);
      } else {
        if (typeof piece !== "number") {
          console.log("SELECT VALID PIECE");
          return;
        }
        setMovingPiece(piece);
      }
    },
    [indexer, movingPiece, runAction],
  );

  const onClickPlayer = (player: number) => {
    if (movingPiece === null || movingPiece === undefined) {
      console.log("SELECT A PIECE TO MOVE HERE");
      return;
    }
    runAction((userId) => ({
      type: ActionType.GivePiece,
      userId,
      piece: movingPiece,
      toPlayer: player,
      now: Date.now(),
    }));
    setMovingPiece(undefined);
  };

  const tempSpaceWidth = state.players[myPlayerNumber].tempSpace[0].length;
  const onClickTempSpaceCell = useCallback(
    (i: number, piece: number | null) =>
      onClickCell(GridName.Temp)(
        { row: Math.floor(i / tempSpaceWidth), column: i % tempSpaceWidth },
        piece,
      ),
    [tempSpaceWidth, onClickCell],
  );

  const myTempSpace = state.players[myPlayerNumber].tempSpace;
  const myFlatTempSpace = useMemo(() => myTempSpace.flat(), [myTempSpace]);

  if (!layoutOutput) {
    return <div ref={containerRef} css={styles.container}></div>;
  }

  const progressGridPaddings =
    3 * (state.puzzleDefinition.size.width + 2) +
    2 * PROGRESS_GRID_PADDING_PX +
    4;
  const progressGridScale = Math.min(
    (layoutOutput[LayoutRectangleName.Board].width - progressGridPaddings) /
      (state.puzzleDefinition.tileWidth * state.puzzleDefinition.size.width),
    (layoutOutput[LayoutRectangleName.Board].height - progressGridPaddings) /
      (state.puzzleDefinition.tileHeight * state.puzzleDefinition.size.height),
  );

  const solvingGridScale = Math.min(
    (layoutOutput[LayoutRectangleName.Solving].width -
      2 * SOLVING_GRID_PADDING_PX) /
      (state.puzzleDefinition.tileWidth *
        (indexer.localRange.to.column - indexer.localRange.from.column + 1)),
    (layoutOutput[LayoutRectangleName.Solving].height -
      2 * SOLVING_GRID_PADDING_PX) /
      (state.puzzleDefinition.tileHeight *
        (indexer.localRange.to.row - indexer.localRange.from.row + 1)),
  );

  return (
    <div ref={containerRef} css={styles.container}>
      <div
        css={styles.rect(
          layoutOutput[LayoutRectangleName.Solving],
          "rgba(255,0,0,0.1)",
        )}
      >
        <div css={styles.solvingGrid}>
          <GridShower
            gridSize={state.puzzleDefinition.size}
            grid={solutionGrid}
            imageURL={state.puzzleDefinition.imageURL}
            onClickCell={onClickCell(GridName.Main)}
            tileHeight={state.puzzleDefinition.tileHeight}
            tileWidth={state.puzzleDefinition.tileWidth}
            highlightEmpty={movingPiece !== undefined}
            scale={solvingGridScale}
          />
        </div>
      </div>
      <div
        css={styles.rect(
          layoutOutput[LayoutRectangleName.Board],
          "rgba(0,255,0,0.1)",
        )}
      >
        <div css={styles.progressArea}>
          <div css={styles.playerGiverWrapper}>
            <PlayerGiver
              playerNames={playerNames}
              myPlayerNumber={myPlayerNumber}
              movingPiece={movingPiece}
              onClickPlayer={onClickPlayer}
            />
            <ProgressGrid
              grid={state.solution.pieces}
              size={state.puzzleDefinition.size}
              tileWidth={Math.floor(
                progressGridScale * state.puzzleDefinition.tileWidth,
              )}
              tileHeight={Math.floor(
                progressGridScale * state.puzzleDefinition.tileHeight,
              )}
            />
          </div>
        </div>
      </div>
      <div
        css={styles.rect(
          layoutOutput[LayoutRectangleName.Temp],
          "rgba(0,0,255,0.1)",
        )}
      >
        <TempSpace
          grid={myFlatTempSpace}
          gridSize={state.puzzleDefinition.size}
          imageURL={state.puzzleDefinition.imageURL}
          onClickCell={onClickTempSpaceCell}
          tileHeight={state.puzzleDefinition.tileHeight}
          tileWidth={state.puzzleDefinition.tileWidth}
          highlightEmpty={movingPiece !== undefined}
          recentReceives={state.players[myPlayerNumber].recentReceives}
          containerHeight={layoutOutput.Temp.height}
          containerWidth={layoutOutput.Temp.width}
        />
      </div>
      <div
        css={styles.rect(
          layoutOutput[LayoutRectangleName.Score],
          "rgba(255,0,255,0.1)",
        )}
      >
        <SolvingScore
          startTime={state.phaseState.startTime}
          swaps={state.phaseState.numberOfSwaps}
        />
      </div>
    </div>
  );
};
