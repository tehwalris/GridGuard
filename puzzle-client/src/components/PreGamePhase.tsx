import React, { useEffect } from "react";
import { ActionType, Player, PreGameState, State } from "puzzle-shared";
import { RunAction } from "../useUnilog";
import { CenteredPage } from "./CenteredPage";
import PreGameLogin from "./PreGameLogin";
import PreGameWait from "./PreGameWait";

interface Props {
  runAction: RunAction;
  connected: boolean;
  state: State & { phaseState: PreGameState };
  myPlayer: Player | undefined;
  myPlayerNumber: number | undefined;
}

const PreGamePhase: React.FC<Props> = ({
  runAction,
  connected,
  myPlayer,
  myPlayerNumber,
  state,
}) => {
  useEffect(() => {
    if (!connected) {
      return;
    }
    const queryParams = new URLSearchParams(window.location.search);
    const playerFromQuery = +(queryParams.get("player") || "NaN");
    if (
      Number.isSafeInteger(playerFromQuery) &&
      playerFromQuery >= 0 &&
      playerFromQuery < state.players.length
    ) {
      runAction((userId) => ({
        type: ActionType.JoinAsPlayer,
        userId,
        player: playerFromQuery,
        name: `Auto ${playerFromQuery}`,
      }));
    }
  }, [connected, state.players.length, runAction]);

  return (
    <CenteredPage>
      {!myPlayer ? (
        <PreGameLogin runAction={runAction} />
      ) : (
        <PreGameWait
          runAction={runAction}
          players={state.players}
          settings={state.gameSettings}
          myPlayerNumber={myPlayerNumber}
          showImagePreviewNow={state.phaseState.showImagePreviewNow}
        />
      )}
    </CenteredPage>
  );
};

export default PreGamePhase;
