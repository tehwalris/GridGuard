import * as kiwi from "kiwi.js";

export interface LayoutInput {
  screen: {
    width: number;
    height: number;
  };
  image: {
    width: number;
    height: number;
  };
}

export interface LayoutRectangle {
  top: number;
  left: number;
  width: number;
  height: number;
}

export enum LayoutRectangleName {
  Solving = "Solving",
  Board = "Board",
  Score = "Score",
  Temp = "Temp",
}

export type LayoutOutput = {
  [key in LayoutRectangleName]: LayoutRectangle;
};

class KiwiRect {
  width = new kiwi.Variable();
  height = new kiwi.Variable();
}

export function computeLayout(layoutInput: LayoutInput): LayoutOutput {
  const solver = new kiwi.Solver();

  const rects: { [key in LayoutRectangleName]: KiwiRect } = {
    [LayoutRectangleName.Solving]: new KiwiRect(),
    [LayoutRectangleName.Board]: new KiwiRect(),
    [LayoutRectangleName.Score]: new KiwiRect(),
    [LayoutRectangleName.Temp]: new KiwiRect(),
  };

  for (const key of Object.keys(LayoutRectangleName)) {
    const rect = rects[key as LayoutRectangleName];
    solver.addEditVariable(rect.width, kiwi.Strength.strong);
    solver.addEditVariable(rect.height, kiwi.Strength.strong);
  }

  solver.addConstraint(
    new kiwi.Constraint(
      new kiwi.Expression(
        rects[LayoutRectangleName.Solving].width,
        rects[LayoutRectangleName.Board].width,
      ),
      kiwi.Operator.Eq,
      layoutInput.screen.width,
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      rects[LayoutRectangleName.Board].width,
      kiwi.Operator.Eq,
      rects[LayoutRectangleName.Score].width,
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      rects[LayoutRectangleName.Temp].width,
      kiwi.Operator.Eq,
      layoutInput.screen.width,
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      new kiwi.Expression(
        rects[LayoutRectangleName.Board].height,
        rects[LayoutRectangleName.Score].height,
      ),
      kiwi.Operator.Eq,
      rects[LayoutRectangleName.Solving].height,
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      new kiwi.Expression(
        rects[LayoutRectangleName.Solving].height,
        rects[LayoutRectangleName.Temp].height,
      ),
      kiwi.Operator.Eq,
      layoutInput.screen.height,
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      rects[LayoutRectangleName.Board].width,
      kiwi.Operator.Ge,
      0.25 * layoutInput.screen.width,
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      rects[LayoutRectangleName.Board].height,
      kiwi.Operator.Ge,
      0.15 * layoutInput.screen.height,
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      rects[LayoutRectangleName.Score].height,
      kiwi.Operator.Ge,
      100,
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      rects[LayoutRectangleName.Score].height,
      kiwi.Operator.Ge,
      new kiwi.Expression([0.5, rects[LayoutRectangleName.Board].height]),
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      rects[LayoutRectangleName.Temp].height,
      kiwi.Operator.Ge,
      250,
    ),
  );

  solver.addConstraint(
    new kiwi.Constraint(
      rects[LayoutRectangleName.Temp].height,
      kiwi.Operator.Ge,
      0.3 * layoutInput.screen.height,
    ),
  );

  solver.suggestValue(
    rects[LayoutRectangleName.Solving].height,
    layoutInput.screen.height,
  );
  solver.suggestValue(
    rects[LayoutRectangleName.Solving].width,
    layoutInput.screen.width,
  );

  solver.updateVariables();

  return {
    [LayoutRectangleName.Solving]: {
      top: 0,
      left: 0,
      width: rects[LayoutRectangleName.Solving].width.value(),
      height: rects[LayoutRectangleName.Solving].height.value(),
    },
    [LayoutRectangleName.Board]: {
      top: 0,
      left: rects[LayoutRectangleName.Solving].width.value(),
      width: rects[LayoutRectangleName.Board].width.value(),
      height: rects[LayoutRectangleName.Board].height.value(),
    },
    [LayoutRectangleName.Score]: {
      top: rects[LayoutRectangleName.Board].height.value(),
      left: rects[LayoutRectangleName.Solving].width.value(),
      width: rects[LayoutRectangleName.Score].width.value(),
      height: rects[LayoutRectangleName.Score].height.value(),
    },
    [LayoutRectangleName.Temp]: {
      top: rects[LayoutRectangleName.Solving].height.value(),
      left: 0,
      width: rects[LayoutRectangleName.Temp].width.value(),
      height: rects[LayoutRectangleName.Temp].height.value(),
    },
  };
}
