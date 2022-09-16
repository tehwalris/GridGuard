/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { ActionType, PostGameState, State } from "puzzle-shared";
import { Box, Button } from "gestalt";
import React from "react";
import { RunAction } from "../useUnilog";
import PostGameWrapper from "./PostGameWrapper";

const styles = {
  image: css({ width: "100%", height: "100%", objectFit: "contain" }),
};

interface Props {
  state: State & { phaseState: PostGameState };
  runAction: RunAction;
}

const PostGame: React.FC<Props> = ({ state, runAction }) => {
  const timeInSec = state.phaseState.totalGameTime;
  const numberOfSwaps = state.phaseState.numberOfSwaps;

  return (
    <PostGameWrapper
      timeInSeconds={timeInSec}
      swaps={numberOfSwaps}
      buttonElement={
        <Box>
          <Button
            text="Restart Game"
            color="red"
            onClick={() => {
              console.log("restarting lobby");
              runAction((userId) => ({
                type: ActionType.RestartLobby,
                userId,
              }));
            }}
          />
        </Box>
      }
    >
      <img css={styles.image} alt="puzzle" src={state.gameSettings.image.url} />
    </PostGameWrapper>
  );
};

export default PostGame;
