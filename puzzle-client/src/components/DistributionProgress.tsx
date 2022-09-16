/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import MultiProgress from "react-multi-progress";

const styles = {
  progressContainer: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "50px",
  }),
  progress: css({
    position: "relative",
    width: "500px",
    marginBottom: 5,
    color: "#f5f8fa",
  }),
  progressLabel: css({
    position: "absolute",
    top: 0,
    zIndex: 3000000,
    lineHeight: "25px",
    width: "100%",
    textAlign: "center",
  }),
};

interface Props {
  progressPercentage: number;
  progressUpdateIntervalMs: number;
  timeRemaining: number;
  secondsForThisPiece: number;
}

const DistributionProgress: React.FC<Props> = ({
  progressPercentage,
  progressUpdateIntervalMs,
  timeRemaining,
  secondsForThisPiece,
}) => {
  return (
    <div css={styles.progressContainer}>
      <div css={styles.progress}>
        <MultiProgress
          transitionTime={0.5}
          elements={[
            {
              value: progressPercentage,
              color: "#137CBD",
            },
          ]}
          height={25}
          backgroundColor="#5C7080"
        />
        <div css={styles.progressLabel}>Distribution Progress</div>
      </div>
      <div css={styles.progress}>
        <MultiProgress
          transitionTime={progressUpdateIntervalMs / 1000}
          elements={[
            {
              value: (timeRemaining / secondsForThisPiece) * 100,
              color: "#137CBD",
            },
          ]}
          height={25}
          backgroundColor="#5C7080"
        />
        <div css={styles.progressLabel}>Countdown</div>
      </div>
    </div>
  );
};

export default DistributionProgress;
