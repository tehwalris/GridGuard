/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { Box, Button } from "gestalt";
import { sumBy } from "lodash";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import {
  ActionType,
  DistributingState,
  distributionTimes,
  getNextDistributionTime,
  State,
} from "puzzle-shared";
import TimeContext from "../timeContext";
import { RunAction } from "../useUnilog";
import DistributionGrid from "./DistributionGrid";
import DistributionProgress from "./DistributionProgress";
import ImageSection from "./ImageSection";

const styles = {
  container: css({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: "5%",
    boxSizing: "border-box",
  }),

  content: css({
    display: "flex",
    maxWidth: 1300,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "flex-start",
    height: 900,
    flexShrink: 1,
  }),
  currentPiece: css({
    width: "350px",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: "30px",
  }),
  playerInboxes: css({
    width: "350px",
    minWidth: "250px",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  }),
};

interface Props {
  state: State & { phaseState: DistributingState };
  myPlayerNumber: number;
  runAction: RunAction;
}

const DistributionPhase: React.FC<Props> = ({
  state,
  myPlayerNumber,
  runAction,
}) => {
  const ts = useContext(TimeContext);

  const [time, setTime] = useState(new Date(ts.now()));

  const queryParams = new URLSearchParams(window.location.search);
  const devMode = typeof queryParams.get("dev") === "string";

  const piece = R.last(state.phaseState.toDistribute[myPlayerNumber]);
  const distributing = state.phaseState.distributor === myPlayerNumber;
  const remainingToDistribute = sumBy(
    state.phaseState.toDistribute,
    (e) => e.length,
  );
  const totalToDistribute = state.phaseState.totalToDistribute;

  const startTime = state.phaseState.pieceStartTime;
  const secondsForThisPiece = getNextDistributionTime({
    alreadyDistributed: totalToDistribute - remainingToDistribute,
    totalToDistribute,
    bounds: distributionTimes[state.gameSettings.distributionTime],
  });
  const timeRemaining =
    secondsForThisPiece + (startTime - time.getTime()) / 1000;
  const progressPercentage =
    ((totalToDistribute - remainingToDistribute) / totalToDistribute) * 100;

  const progressUpdateIntervalMs = 100;

  useEffect(() => {
    if (devMode && distributing && piece) {
      runAction((userId) => ({
        type: ActionType.GivePiece,
        userId,
        now: ts.now(),
        toPlayer: Math.floor(Math.random() * 4),
        piece,
      }));
    }
  }, [devMode, piece, distributing, runAction, ts]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date(ts.now());
      // HACK Might give away the same piece every second!
      if (ts.now() - startTime > 1000 * secondsForThisPiece && distributing) {
        runAction((userId) => ({
          type: ActionType.GivePiece,
          userId,
          now: ts.now(),
          toPlayer: Math.floor(Math.random() * 4),
          piece: piece!,
        }));
      }
      setTime(newTime);
    }, progressUpdateIntervalMs);
    return () => {
      clearInterval(interval);
    };
  }, [startTime, piece, distributing, runAction, secondsForThisPiece, ts]);

  const distributingPlayer = state.players[state.phaseState.distributor];
  const distributingPlayerName = distributingPlayer.name
    ? distributingPlayer.name
    : "Player " + state.phaseState.distributor;
  return (
    <div css={styles.container}>
      <DistributionProgress
        timeRemaining={timeRemaining}
        secondsForThisPiece={secondsForThisPiece}
        progressPercentage={progressPercentage}
        progressUpdateIntervalMs={progressUpdateIntervalMs}
      />
      <div css={styles.content}>
        <DistributionGrid
          grid={state.players[myPlayerNumber].tempSpace.flat()}
          gridSize={state.puzzleDefinition.size}
          imageURL={state.puzzleDefinition.imageURL}
          tileHeight={state.puzzleDefinition.tileHeight}
          tileWidth={state.puzzleDefinition.tileWidth}
        />
        <div>
          <div css={styles.currentPiece}>
            {state.phaseState.distributor === myPlayerNumber ? (
              <ImageSection
                scale={Math.min(
                  180 / state.puzzleDefinition.tileWidth,
                  180 / state.puzzleDefinition.tileHeight,
                )}
                display={piece != null}
                imageURL={state.puzzleDefinition.imageURL}
                tileHeight={state.puzzleDefinition.tileHeight}
                tileWidth={state.puzzleDefinition.tileWidth}
                offsetLeft={
                  (piece! % state.puzzleDefinition.size.width) *
                  state.puzzleDefinition.tileWidth
                }
                offsetTop={
                  Math.floor(piece! / state.puzzleDefinition.size.width) *
                  state.puzzleDefinition.tileHeight
                }
                imageWidth={
                  state.puzzleDefinition.tileWidth *
                  state.puzzleDefinition.size.width
                }
                imageHeight={
                  state.puzzleDefinition.tileHeight *
                  state.puzzleDefinition.size.height
                }
              />
            ) : (
              distributingPlayerName + " is currently distributing"
            )}
          </div>
          <div css={styles.playerInboxes}>
            {state.players.map((player, i) => (
              <Box padding={1} width={150}>
                <Button
                  color="blue"
                  text={player.name ? player.name : "Player " + i}
                  disabled={!distributing}
                  onClick={() =>
                    distributing && piece != null
                      ? runAction((userId) => ({
                          type: ActionType.GivePiece,
                          userId,
                          now: ts.now(),
                          toPlayer: i,
                          piece: piece,
                        }))
                      : undefined
                  }
                />
              </Box>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionPhase;
