/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { Box, Button, SelectList, TextField } from "gestalt";
import { useState } from "react";
import { ActionType } from "puzzle-shared";
import { RunAction } from "../useUnilog";

interface Props {
  runAction: RunAction;
}
const styles = {
  container: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }),
};

const PreGameLogin: React.FC<Props> = ({ runAction }) => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [name, setName] = useState("");
  const changePlayerSelection = ({
    value,
  }: {
    event: React.SyntheticEvent<HTMLElement>;
    value: string;
  }) => {
    setSelectedUser(+value);
  };
  const changeUsername = ({
    value,
  }: {
    event: React.SyntheticEvent<HTMLElement>;
    value: string;
  }) => {
    setName(value);
  };

  return (
    <div css={styles.container}>
      <Box paddingY={2} width="200px">
        <TextField
          id="selectName"
          placeholder="Player name"
          onChange={changeUsername}
        />
      </Box>
      <Box paddingY={2} width="200px">
        <SelectList
          id="selectPlayer"
          onChange={changePlayerSelection}
          options={[
            { label: "Top-Left", value: "0" },
            { label: "Top-Right", value: "1" },
            { label: "Bottom-Left", value: "2" },
            { label: "Bottom-Right", value: "3" },
          ]}
          size="md"
        />
      </Box>
      <Box paddingY={2}>
        <Button
          text="Connect"
          onClick={() => {
            if (name) {
              runAction((userId) => ({
                type: ActionType.JoinAsPlayer,
                userId,
                player: selectedUser,
                name,
              }));
            }
          }}
        />
      </Box>
    </div>
  );
};
export default PreGameLogin;
