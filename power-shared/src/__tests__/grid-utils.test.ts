import { GridPlacement } from "../interfaces/state";
import * as R from "ramda";
import { placePiecesWhereEmpty } from "../grid-utils";

describe("placePiecesWhereEmpty", () => {
  interface Case {
    label: string;
    oldPlacement: GridPlacement;
    piecesToPlace: number[];
    newPlacement: GridPlacement | undefined;
  }

  const cases: Case[] = [
    {
      label: "empty grid",
      oldPlacement: [],
      piecesToPlace: [],
      newPlacement: [],
    },
    {
      label: "single element grid (empty, nothing placed)",
      oldPlacement: [[null]],
      piecesToPlace: [],
      newPlacement: [[null]],
    },
    {
      label: "single element grid (empty, single piece placed)",
      oldPlacement: [[null]],
      piecesToPlace: [5],
      newPlacement: [[5]],
    },
    {
      label: "single element grid (empty, attempt to place 2)",
      oldPlacement: [[null]],
      piecesToPlace: [5, 6],
      newPlacement: undefined,
    },
    {
      label: "small grid (partially filled, nothing placed)",
      oldPlacement: [
        [null, null, 8],
        [3, null, null],
      ],
      piecesToPlace: [],
      newPlacement: [
        [null, null, 8],
        [3, null, null],
      ],
    },
    {
      label: "small grid (partially filled, 2 placed)",
      oldPlacement: [
        [null, null, 8],
        [3, null, null],
      ],
      piecesToPlace: [9, 6],
      newPlacement: [
        [9, 6, 8],
        [3, null, null],
      ],
    },
    {
      label: "small grid (partially filled, enough placed to fill)",
      oldPlacement: [
        [null, null, 8],
        [3, null, null],
      ],
      piecesToPlace: [9, 6, 4, 7],
      newPlacement: [
        [9, 6, 8],
        [3, 4, 7],
      ],
    },
    {
      label: "small grid (partially filled, attempt to place one too many)",
      oldPlacement: [
        [null, null, 8],
        [3, null, null],
      ],
      piecesToPlace: [9, 6, 4, 7, 1],
      newPlacement: undefined,
    },
    {
      label: "duplicate inputs",
      oldPlacement: [
        [null, null, 8],
        [3, null, null],
      ],
      piecesToPlace: [9, 6, 6],
      newPlacement: undefined,
    },
    {
      label: "duplicate result",
      oldPlacement: [
        [null, null, 8],
        [3, null, null],
      ],
      piecesToPlace: [9, 3],
      newPlacement: undefined,
    },
  ];

  for (const c of cases) {
    test(c.label, () => {
      const passedOldPlacement = R.clone(c.oldPlacement);
      const passedPiecesToPlace = R.clone(c.piecesToPlace);
      if (c.newPlacement === undefined) {
        expect(() =>
          placePiecesWhereEmpty(passedOldPlacement, passedPiecesToPlace),
        ).toThrow();
      } else {
        const actualNewPlacement = placePiecesWhereEmpty(
          passedOldPlacement,
          passedPiecesToPlace,
        );
        expect(actualNewPlacement).toEqual(c.newPlacement);
      }
      expect(passedOldPlacement).toEqual(c.oldPlacement);
      expect(passedPiecesToPlace).toEqual(c.piecesToPlace);
    });
  }
});
