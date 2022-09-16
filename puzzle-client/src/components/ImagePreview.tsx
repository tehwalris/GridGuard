/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { RunAction } from "../useUnilog";
import { Box, Button } from "gestalt";
import { ActionType } from "puzzle-shared";
import TimeContext from "../timeContext";
import React from "react";

const styles = {
  image: css({
    width: "100%",
    height: "100%",
    objectFit: "contain",
    maxWidth: "1000px",
    maxHeight: "600px",
  }),
  container: css({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),
};

interface Props {
  imageURL: string;
  runAction: RunAction;
}

const SolvingScore: React.FC<Props> = ({ imageURL, runAction }) => {
  const ts = React.useContext(TimeContext);
  return (
    <div css={styles.container}>
      <img css={styles.image} alt="puzzle" src={imageURL} />
      <Box width="300px" paddingY={8}>
        <Button
          onClick={() => {
            runAction(() => ({
              type: ActionType.StartGame,
              now: ts.now(),
              seed: Math.floor(Math.random() * 1e6),
            }));
          }}
          color="blue"
          text="Start Game"
        />
      </Box>
    </div>
  );
};

export default SolvingScore;
