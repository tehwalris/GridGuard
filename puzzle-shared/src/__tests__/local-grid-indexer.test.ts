import { GridLocationRange, GridSize } from "../interfaces/state";
import { LocalGridIndexer } from "../local-grid-indexer";

describe("LocalGridIndexer", () => {
  describe("constructor allows only valid inputs", () => {
    type InputTemplate = [
      string,
      [number, number],
      [number, number],
      [number, number],
    ];
    const inputFromTemplate = ([
      label,
      globalSize,
      localFrom,
      localTo,
    ]: InputTemplate): [GridSize, GridLocationRange] => [
      { height: globalSize[0], width: globalSize[1] },
      {
        from: { row: localFrom[0], column: localFrom[1] },
        to: { row: localTo[0], column: localTo[1] },
      },
    ];

    const goodInputs: InputTemplate[] = [
      ["smallest possible grid", [1, 1], [0, 0], [0, 0]],
      ["grid with local = global", [8, 5], [0, 0], [7, 4]],
      ["grid with small local", [8, 5], [3, 2], [5, 4]],
    ];
    const badInputs: InputTemplate[] = [
      ["zero-size grid", [0, 0], [0, 0], [0, 0]],
      ["negative-size grid (height)", [-5, 1], [0, 0], [0, 0]],
      ["negative-size grid (width)", [1, -5], [0, 0], [0, 0]],
      [
        "grid with local a bit larger than global (positive)",
        [8, 5],
        [0, 0],
        [8, 5],
      ],
      [
        "grid with local a bit larger than global (negative)",
        [8, 5],
        [-1, -1],
        [7, 4],
      ],
      ["grid with out-of-bounds small local", [8, 5], [3, 2], [5, 7]],
    ];

    goodInputs.forEach((template, i) => {
      test(`good input ${i}`, () => {
        new LocalGridIndexer(...inputFromTemplate(template));
      });
    });
    badInputs.forEach((template, i) => {
      test(`bad input ${i}`, () => {
        expect(() => {
          new LocalGridIndexer(...inputFromTemplate(template));
        }).toThrow();
      });
    });
  });

  describe("forPlayer", () => {
    test("typical split", () => {
      const globalSize: GridSize = { height: 8, width: 14 };
      const localRanges = [
        [
          [0, 0],
          [3, 6],
        ],
        [
          [0, 7],
          [3, 13],
        ],
        [
          [4, 0],
          [7, 6],
        ],
        [
          [4, 7],
          [7, 13],
        ],
      ].map(
        (t): GridLocationRange => ({
          from: { row: t[0][0], column: t[0][1] },
          to: { row: t[1][0], column: t[1][1] },
        }),
      );
      for (const [i, expectedLocalRange] of localRanges.entries()) {
        expect(
          localRanges.map(
            (expectedLocalRange, i) =>
              LocalGridIndexer.forPlayer(globalSize, i).localRange,
          ),
        ).toEqual(localRanges.map((expectedLocalRange) => expectedLocalRange));
      }
    });
  });

  describe("globalToLocal", () => {
    interface TestCase {
      label: string;
      global: [number, number];
      local: [number, number] | undefined;
    }
    const cases: TestCase[] = [
      { label: "out of local range", global: [0, 0], local: undefined },
      {
        label: "top left corner of local range",
        global: [0, 7],
        local: [0, 0],
      },
      {
        label: "just left of top left corner of local range",
        global: [0, 6],
        local: undefined,
      },
      {
        label: "bottom left corner of local range",
        global: [3, 7],
        local: [3, 0],
      },
      {
        label: "just below bottom left corner of local range",
        global: [4, 7],
        local: undefined,
      },
      {
        label: "top right corner of local range",
        global: [0, 13],
        local: [0, 6],
      },
      {
        label: "just right of top right corner of local range",
        global: [0, 14],
        local: undefined,
      },
      {
        label: "bottom right corner of local range",
        global: [3, 13],
        local: [3, 6],
      },
      {
        label: "just below bottom right corner of local range",
        global: [4, 13],
        local: undefined,
      },
    ];
    for (const c of cases) {
      test(c.label, () => {
        const global = { row: c.global[0], column: c.global[1] };
        const expectedLocal = c.local && {
          row: c.local[0],
          column: c.local[1],
        };

        const indexer = LocalGridIndexer.forPlayer({ height: 8, width: 14 }, 1);
        expect(indexer.globalToLocal(global)).toEqual(expectedLocal);
      });
    }
  });

  describe("localToGlobal", () => {
    interface TestCase {
      label: string;
      local: [number, number];
      global: [number, number] | undefined;
    }
    const cases: TestCase[] = [
      {
        label: "top left corner of local range",
        local: [0, 0],
        global: [0, 7],
      },
      {
        label: "left of top left corner of local range",
        local: [0, -1],
        global: undefined,
      },
      {
        label: "bottom right corner of local range",
        local: [3, 6],
        global: [3, 13],
      },
      {
        label: "just below bottom right corner of local range",
        local: [4, 6],
        global: undefined,
      },
    ];
    for (const c of cases) {
      test(c.label, () => {
        const local = { row: c.local[0], column: c.local[1] };
        const expectedGlobal = c.global && {
          row: c.global[0],
          column: c.global[1],
        };

        const indexer = LocalGridIndexer.forPlayer({ height: 8, width: 14 }, 1);
        if (expectedGlobal) {
          expect(indexer.localToGlobal(local)).toEqual(expectedGlobal);
        } else {
          expect(() => indexer.localToGlobal(local)).toThrow();
        }
      });
    }
  });

  test("getAtLocal", () => {
    const indexer = LocalGridIndexer.forPlayer({ height: 4, width: 4 }, 1);
    const data = [
      ["00", "01", "02", "03"],
      ["10", "11", "12", "13"],
      ["20", "21", "22", "23"],
      ["30", "31", "32", "33"],
    ];
    expect(indexer.getAtLocal(data, { row: 0, column: 0 })).toEqual("02");
    expect(indexer.getAtLocal(data, { row: 1, column: 1 })).toEqual("13");
    indexer.setAtLocal(data, { row: 1, column: 0 }, "walrus");
    expect(data[1][2]).toEqual("walrus");
  });

  test("extractLocal", () => {
    const indexer = LocalGridIndexer.forPlayer({ height: 4, width: 4 }, 1);
    expect(
      indexer.extractLocal([
        ["00", "01", "02", "03"],
        ["10", "11", "12", "13"],
        ["20", "21", "22", "23"],
        ["30", "31", "32", "33"],
      ]),
    ).toEqual([
      ["02", "03"],
      ["12", "13"],
    ]);
  });
});
