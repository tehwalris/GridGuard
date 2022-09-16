import "gestalt/dist/gestalt.css";
import path from "path";
import React from "react";
import { useParams } from "react-router-dom";
import {
  DistributingState,
  Phase,
  PostGameState,
  PreGameState,
  SolvingState,
  State,
} from "puzzle-shared";
import { useUnilog } from "../useUnilog";
import DistributionPhase from "./DistributionPhase";
import SelfFinishedScreen from "./SelfFinishedScreen";
import { SolvingPhase } from "./SolvingPhase";
import AllFinishedScreen from "./AllFinishedScreen";
import PreGamePhase from "./PreGamePhase";
//import SolvingPhase from "./SolvingPhase";
const serverOrigin =
  process.env.NODE_ENV === "development"
    ? `${window.location.hostname}:8088`
    : window.location.host;
const wsServerBaseUrl = `${
  window.location.protocol === "https:" ? "wss" : "ws"
}://${serverOrigin}`;

// get synchronized time

export const Lobby = () => {
  const { lobbyCode } = useParams<{ lobbyCode: string }>();

  const wsUrl = path.join(wsServerBaseUrl, "lobbies", lobbyCode);
  const { state, userId, runAction } = useUnilog(wsUrl);

  const myUser = state.users.find((user) => user.id === userId);
  const myPlayer =
    myUser?.player !== undefined && myUser?.player !== null
      ? state.players[myUser.player]
      : undefined;
  const myPlayerNumber = myUser?.player ?? undefined;

  const phase = state.phaseState.phase;

  if (
    phase === Phase.PreGame ||
    myPlayer === undefined ||
    myPlayerNumber === undefined
  ) {
    return (
      <PreGamePhase
        connected={!!myUser}
        runAction={runAction}
        myPlayer={myPlayer}
        myPlayerNumber={myPlayerNumber}
        state={state as State & { phaseState: PreGameState }}
      />
    );
  } else if (phase === Phase.Distributing) {
    return (
      <DistributionPhase
        state={state as State & { phaseState: DistributingState }}
        myPlayerNumber={myPlayerNumber}
        runAction={runAction}
      />
    );
  } else if (phase === Phase.Solving && !myPlayer.finished) {
    return (
      <SolvingPhase
        state={state as State & { phaseState: SolvingState }}
        myPlayerNumber={myPlayerNumber}
        runAction={runAction}
      />
    );
  } else if (phase === Phase.Solving && myPlayer.finished) {
    return (
      <SelfFinishedScreen
        state={state as State & { phaseState: SolvingState }}
      />
    );
  } else if (phase === Phase.PostGame) {
    return (
      <AllFinishedScreen
        state={state as State & { phaseState: PostGameState }}
        runAction={runAction}
      />
    );
  } else {
    return <div>invalid phase</div>;
  }
};
