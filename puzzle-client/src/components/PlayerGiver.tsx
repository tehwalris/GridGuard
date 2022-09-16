/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";

const styles = {
  playerGiverContainer: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    borderRadius: "3px",
    overflow: "hidden",
  }),
  playerGiver: (
    vertical: string,
    horizontal: string,
    displayOverlay: boolean,
    me: boolean,
  ) =>
    css({
      width: "50%",
      height: "50%",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      opacity: 0.95,
      outline: "3px solid #0e5a8a",
      boxSizing: "border-box",
      display: displayOverlay ? "flex" : "none",
      background: me ? "#137CBD" : "#48AFF0",
      top: vertical === "top" ? "0px" : undefined,
      bottom: vertical === "bottom" ? "0px" : undefined,
      left: horizontal === "left" ? "0px" : undefined,
      right: horizontal === "right" ? "0px" : undefined,
    }),
};

interface Props {
  onClickPlayer: (playerNumber: number) => void;
  movingPiece: number | undefined;
  myPlayerNumber: number;
  playerNames: string[];
}

const PlayerGiver: React.FC<Props> = ({
  movingPiece,
  myPlayerNumber,
  playerNames,
  onClickPlayer,
}) => {
  return (
    <div css={styles.playerGiverContainer}>
      <div
        css={styles.playerGiver(
          "top",
          "left",
          movingPiece !== undefined,
          myPlayerNumber === 0,
        )}
        onClick={() => onClickPlayer(0)}
      >
        {playerNames[0]}
      </div>
      <div
        css={styles.playerGiver(
          "top",
          "right",
          movingPiece !== undefined,
          myPlayerNumber === 1,
        )}
        onClick={() => onClickPlayer(1)}
      >
        {playerNames[1]}
      </div>
      <div
        css={styles.playerGiver(
          "bottom",
          "left",
          movingPiece !== undefined,
          myPlayerNumber === 2,
        )}
        onClick={() => onClickPlayer(2)}
      >
        {playerNames[2]}
      </div>
      <div
        css={styles.playerGiver(
          "bottom",
          "right",
          movingPiece !== undefined,
          myPlayerNumber === 3,
        )}
        onClick={() => onClickPlayer(3)}
      >
        {playerNames[3]}
      </div>
    </div>
  );
};

export default PlayerGiver;
