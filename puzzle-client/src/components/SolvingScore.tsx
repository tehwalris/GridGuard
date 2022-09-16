/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { useContext, useEffect, useState } from "react";
import TimeContext from "../timeContext";

const styles = {
  scores: css({
    display: "flex",
    widht: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }),
  score: css({ fontSize: 40, margin: 10, fontWeight: 500 }),
};

interface Props {
  startTime: number;
  swaps: number;
}

const SolvingScore: React.FC<Props> = ({ startTime, swaps }) => {
  const ts = useContext(TimeContext);

  const [time, setTime] = useState(ts.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(ts.now());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [ts]);
  const timeInSeconds = (time - startTime) / 1000;
  return (
    <div css={styles.scores}>
      <div css={styles.score}>
        {`${Math.floor(timeInSeconds / 60)}m ${Math.floor(
          timeInSeconds % 60,
        )}s`}
      </div>
      <div css={styles.score}>{`${swaps} swaps`}</div>
    </div>
  );
};

export default SolvingScore;
