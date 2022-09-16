/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { Box, Heading, Modal, Layer, Tooltip, IconButton } from "gestalt";
import { useState } from "react";

interface Props {}
const styles = {
  helpButton: css({ position: "absolute", top: 110, right: 110 }),
};
const ShowHelp: React.FC<Props> = () => {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div>
      <div css={styles.helpButton}>
        <Tooltip text="Show Help">
          <IconButton
            accessibilityLabel="Open edit modal to edit Board"
            icon="question-mark"
            size="lg"
            bgColor="transparentDarkGray"
            onClick={() => setShowHelp(true)}
          />
        </Tooltip>
      </div>
      {showHelp && (
        <Layer>
          <Modal
            accessibilityModalLabel="Show 'How to play Puzzle With Friends' help"
            heading="How to play 'Puzzle with Friends':"
            onDismiss={() => {
              setShowHelp(false);
            }}
            size="lg"
            footer={<div />}
          >
            <Box padding={2} paddingX={6}>
              <Heading size="sm">1. Wait for all 4 players to join.</Heading>
              <div>
                Also, join with them any audio-chat service of your choice. (For
                example Discord or Zoom)
              </div>
            </Box>
            <Box padding={2} paddingX={6}>
              <Heading size="sm">2. Configure the game to your liking.</Heading>
            </Box>
            <Box padding={2} paddingX={6}>
              <Heading size="sm">3. Start the game.</Heading>
            </Box>
            <Box padding={2} paddingX={6}>
              <Heading size="sm">
                4. Wait for your turn to distribute a piece.
              </Heading>
              <div>
                Describe it to the others. They should give you feedback if your
                piece matches the pieces they already have. Click a button on
                the right to assign it to the right player.
              </div>
            </Box>
            <Box padding={2} paddingX={6}>
              <Heading size="sm">
                5. Once all the pieces are distributed, solve your section.
              </Heading>
            </Box>
            <Box padding={2} paddingX={6}>
              <Heading size="sm">6. Have fun!</Heading>
            </Box>
          </Modal>
        </Layer>
      )}
    </div>
  );
};

export default ShowHelp;
