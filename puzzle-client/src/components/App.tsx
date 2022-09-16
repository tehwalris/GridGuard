/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { Box, Button, TextField } from "gestalt";
import React, { useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { isLobbyCodeValid, randomLobbyCode } from "puzzle-shared";
import TimeContext from "../timeContext";
import { CenteredPage } from "./CenteredPage";
import { Lobby } from "./Lobby";
import * as timesync from "timesync";
import { LayoutDemo } from "./LayoutDemo";

const serverOrigin =
  process.env.NODE_ENV === "development"
    ? `${window.location.hostname}:8088`
    : window.location.host;

const ts = timesync.create({
  server: "http://" + serverOrigin + "/timesync",
  interval: 10000,
});

// get notified on changes in the offset
ts.on("change", function (offset: any) {
  console.log("changed offset: " + offset + " ms");
});

const styles = {
  separatorText: css({
    fontWeight: "bold",
    textAlign: "center",
  }),
};

export const App = () => {
  const [joinLobbyCode, setJoinLobbyCode] = useState("");

  const history = useHistory();
  const openLobby = (lobbyCode: string) => history.push(`/play/${lobbyCode}`);

  return (
    <Switch>
      <Route path="/" exact>
        <CenteredPage>
          <Box paddingY={1}>
            <Button
              onClick={() => openLobby(randomLobbyCode())}
              text="Create new lobby"
            />
          </Box>
          <Box paddingY={1}>
            <div css={styles.separatorText}>OR</div>
          </Box>
          <Box paddingY={1}>
            <TextField
              id="join-lobby-code"
              value={joinLobbyCode}
              onChange={({ value }) => setJoinLobbyCode(value)}
              placeholder="Lobby code"
            />
          </Box>
          <Box paddingY={1}>
            <Button
              text="Join existing lobby"
              disabled={!isLobbyCodeValid(joinLobbyCode)}
              onClick={() => openLobby(joinLobbyCode)}
            />
          </Box>
        </CenteredPage>
      </Route>
      <Route path="/play/:lobbyCode">
        <TimeContext.Provider value={ts}>
          <Lobby />
        </TimeContext.Provider>
      </Route>
      <Route path="/layoutDemo">
        <LayoutDemo />
      </Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};
