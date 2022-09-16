/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import { times } from "lodash";
import { useMemo } from "react";
import { computeLayout, LayoutInput, LayoutOutput } from "../layout";
import { MiniLayout } from "./MiniLayout";

const ROWS = 4;
const COLUMNS = 4;

const styles = {
  outerWrapper: css({
    display: "grid",
    height: "100vh",
    gridTemplateColumns: `repeat(${COLUMNS}, auto)`,
    gridTemplateRows: `repeat(${ROWS}, auto)`,
    gridGap: "15px",
  }),
  cellWrapper: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
};

export const LayoutDemo = () => {
  const layouts = useMemo(
    () =>
      times(ROWS * COLUMNS, (): {
        input: LayoutInput;
        output: LayoutOutput;
      } => {
        const a = 500 + Math.random() * 1500;
        const b = 500 + Math.random() * 1500;
        const input: LayoutInput = {
          screen: {
            width: Math.max(a, b),
            height: Math.min(a, b),
          },
          image: {
            width: 200 + Math.random() * 1000,
            height: 200 + Math.random() * 1000,
          },
        };
        return { input, output: computeLayout(input) };
      }),
    [],
  );

  return (
    <div css={styles.outerWrapper}>
      {layouts.map(({ input, output }, i) => (
        <div css={styles.cellWrapper} key={i}>
          <MiniLayout
            layoutInput={input}
            layoutOutput={output}
            scalingFactor={0.125}
          />
        </div>
      ))}
    </div>
  );
};
