/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React from "react";

interface Props {
  timeInSeconds: number;
  swaps: number;
  children: React.ReactNode;
  buttonElement?: React.ReactNode;
}

const styles = {
  container: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    height: "100%",
    padding: 80,
    paddingBottom: 40,
    boxSizing: "border-box",
  }),
  childContainer: css({ flexGrow: 1, height: 100 }),
  labels: css({
    alignSelf: "center",
    display: "flex",
    minWidth: "500px",
    width: "40%",
    justifyContent: "space-between",
    fontSize: 65,
    fontWeight: 500,
    marginTop: "50px",
    marginBottom: 20,
    height: 100,
  }),
  button: css({ height: 50, width: 200, alignSelf: "center" }),
};

const PostGameWrapper: React.FC<Props> = ({
  timeInSeconds,
  swaps,
  children,
  buttonElement,
}) => {
  return (
    <div css={styles.container}>
      <div css={styles.childContainer}>{children}</div>
      <div css={styles.labels}>
        <div>
          {`${Math.floor(timeInSeconds / 60)}m ${Math.floor(
            timeInSeconds % 60,
          )}s`}
        </div>
        <div>{`${swaps} swaps`}</div>
      </div>
      <div css={styles.button}>{buttonElement}</div>
    </div>
  );
};

export default PostGameWrapper;
