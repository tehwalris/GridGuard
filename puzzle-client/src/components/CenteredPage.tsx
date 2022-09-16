/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import React from "react";
import { Box, Heading } from "gestalt";

interface Props {
  children: React.ReactNode;
}

const styles = {
  container: css({
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
  }),
};

export const CenteredPage = ({ children }: Props) => {
  return (
    <div css={styles.container}>
      <Heading accessibilityLevel={1} size="lg">
        Puzzle with Friends
      </Heading>
      <Box paddingY={8} minHeight="562px">
        {children}
      </Box>
    </div>
  );
};
