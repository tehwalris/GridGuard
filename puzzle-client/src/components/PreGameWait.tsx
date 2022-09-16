/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React, { useContext } from "react";
import { ActionType, Player, GameSettings } from "puzzle-shared";
import { RunAction } from "../useUnilog";
import PreGameSettings from "./PreGameSettings";

import { Box, Button, Heading, TextField } from "gestalt";
import TimeContext from "../timeContext";
import ImagePreview from "./ImagePreview";
import ShowHelp from "./ShowHelp";

interface Props {
  players: Player[];
  myPlayerNumber: number | undefined;
  runAction: RunAction;
  settings: GameSettings;
  showImagePreviewNow: boolean;
}

const styles = {
  container: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }),
  playerGiverContainer: css({
    marginTop: "10px",
    width: "200px",
    height: "120px",
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
  }),
  playerGiver: (top: number, left: number, me: boolean) =>
    css({
      width: "100px",
      height: "60px",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      opacity: 0.95,
      outline: "3px solid #0e5a8a",
      boxSizing: "border-box",
      display: "flex",
      background: me ? "#137CBD" : "#48AFF0",
      top: top + "px",
      left: left + "px",
    }),
};
const PreGameWait: React.FC<Props> = ({
  runAction,
  players,
  settings,
  showImagePreviewNow,
  myPlayerNumber,
}) => {
  const names = players.map((player) => player.name);
  const ts = useContext(TimeContext);

  if (showImagePreviewNow) {
    return <ImagePreview imageURL={settings.image.url} runAction={runAction} />;
  }

  return (
    <div css={styles.container}>
      <ShowHelp />
      <Box
        display="flex"
        alignItems="start"
        width="800px"
        justifyContent="around"
      >
        <Box display="flex" direction="column">
          <Heading size="md">Players</Heading>
          <div css={styles.playerGiverContainer}>
            <div css={styles.playerGiver(0, 0, myPlayerNumber === 0)}>
              {names[0] ? names[0] : "waiting..."}
            </div>
            <div css={styles.playerGiver(0, 100, myPlayerNumber === 1)}>
              {names[1] ? names[1] : "waiting..."}
            </div>
            <div css={styles.playerGiver(60, 0, myPlayerNumber === 2)}>
              {names[2] ? names[2] : "waiting..."}
            </div>
            <div css={styles.playerGiver(60, 100, myPlayerNumber === 3)}>
              {names[3] ? names[3] : "waiting..."}
            </div>
          </div>
        </Box>
        <Box>
          <Heading size="md">Invite Players</Heading>
          <Box paddingY={2}>
            <TextField
              id="url"
              onChange={() => undefined}
              value={window.location.href}
            ></TextField>
          </Box>
          <PreGameSettings settings={settings} runAction={runAction} />
        </Box>
      </Box>
      <Box width="300px" paddingY={8}>
        <Button
          onClick={() => {
            if (settings.enableImagePreview) {
              runAction((userId) => ({
                type: ActionType.ShowImagePreviewNow,
                userId,
              }));
            } else {
              runAction(() => ({
                type: ActionType.StartGame,
                now: ts.now(),
                seed: Math.floor(Math.random() * 1e6),
              }));
            }
          }}
          disabled={names.includes("")}
          text={
            settings.enableImagePreview ? "Start Image Preview" : "Start Game"
          }
          color="blue"
        />
      </Box>
    </div>
  );
};
export default PreGameWait;
