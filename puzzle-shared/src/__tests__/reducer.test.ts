import {
  Action,
  ActionType,
  GridName,
  MoveDestinationType,
} from "../interfaces/action";
import {
  DistributingState,
  DistributionTime,
  NumberOfTiles,
  Phase,
  PreGameState,
  SolvingState,
  State,
} from "../interfaces/state";
import { produce, Draft } from "immer";
import { checkFinishedPlayers, makeInitialState, reducer } from "../reducer";

describe("reducer", () => {
  function makeReducerTest(
    modifyInputState: (state: State) => void,
    action: Action,
    modifyAsExpected: (state: Draft<State>) => void,
  ) {
    return () => {
      const inputState = makeInitialState(
        { height: 8, width: 14 },
        { height: 3, width: 12 },
        4,
      );
      modifyInputState(inputState);
      const expectedOutputState = produce(inputState, (state) =>
        modifyAsExpected(state),
      );
      expect(reducer(inputState, action)).toEqual(expectedOutputState);
    };
  }

  function makeReducerErrorTest(
    modifyInputState: (state: State) => void,
    action: Action,
    expectedError: RegExp,
  ) {
    return () => {
      const inputState = makeInitialState(
        { height: 8, width: 14 },
        { height: 3, width: 12 },
        4,
      );
      modifyInputState(inputState);
      expect(() => reducer(inputState, action)).toThrowError(expectedError);
    };
  }

  describe("JoinAsPlayerAction", () => {
    test(
      "first player joins",
      makeReducerTest(
        (state) => {
          state.users.push({ id: "user-abc" });
        },
        {
          type: ActionType.JoinAsPlayer,
          userId: "user-abc",
          player: 0,
          name: "Philippe",
        },
        (state) => {
          state.players[0].name = "Philippe";
          state.users[0].player = 0;
        },
      ),
    );
    test(
      "third player joins",
      makeReducerTest(
        (state) => {
          state.users = [{ id: "user-0" }, { id: "user-1" }, { id: "user-2" }];
          state.players[0].name = "Philippe";
          state.players[2].name = "Tom";
        },
        {
          type: ActionType.JoinAsPlayer,
          userId: "user-2",
          player: 1,
          name: "Bob",
        },
        (state) => {
          state.players[1].name = "Bob";
          state.users[2].player = 1;
        },
      ),
    );
    test(
      "player replaces existing slot",
      makeReducerTest(
        (state) => {
          state.users = [{ id: "user-0" }, { id: "user-1" }, { id: "user-2" }];
          state.players[0].name = "Philippe";
          state.players[2].name = "Tom";
        },
        {
          type: ActionType.JoinAsPlayer,
          userId: "user-2",
          player: 2,
          name: "Bob",
        },
        (state) => {
          state.players[2].name = "Bob";
          state.users[2].player = 2;
        },
      ),
    );
  });

  test("StartGameAction", () => {
    const inputState = makeInitialState(
      { height: 8, width: 14 },
      { height: 4, width: 8 },
      4,
    );
    inputState.gameSettings = {
      image: {
        url: "https://i.imgur.com/PuoRzgD.jpg",
        width: 840,
        height: 480,
      },
      roughNumberOfTiles: NumberOfTiles.Medium,
      distributionTime: DistributionTime.Long,
      enableImagePreview: false,
    };

    const baseAction: Action = {
      type: ActionType.StartGame,
      now: +new Date("2021-02-28T15:54:19+0000"),
      seed: 123,
    };
    const baseOutputState = reducer(inputState, baseAction);
    expect(baseOutputState.phaseState).toMatchSnapshot();
    expect(baseOutputState.players.map((p) => p.tempSpace)).toMatchSnapshot();

    expect(baseOutputState).not.toEqual(
      reducer(inputState, { ...baseAction, seed: baseAction.seed + 1 }),
    );

    const expectedOutputState = produce(inputState, (state) => {
      state.phaseState = baseOutputState.phaseState;
      for (const [i, player] of state.players.entries()) {
        player.tempSpace = baseOutputState.players[i].tempSpace;
      }
    });
    expect(baseOutputState).toEqual(expectedOutputState);
  });

  describe("GivePiece", () => {
    test(
      "not allowed in Phase.PreGame",
      makeReducerErrorTest(
        (state) => {
          state.users.push({ id: "user-abc", player: 2 });
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 72,
          toPlayer: 1,
        },
        /in this phase/,
      ),
    );
    test(
      "typical give during distribution",
      makeReducerTest(
        (state) => {
          state.phaseState = {
            phase: Phase.Distributing,
            pieceStartTime: +new Date("2021-02-28T15:54:14+0000"),
            distributor: 2,
            toDistribute: [[52, 7], [18], [2, 25], [9]],
            totalToDistribute: 8,
          };
          state.users.push({ id: "user-abc", player: 2 });
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 25,
          toPlayer: 1,
        },
        (state) => {
          const phaseState = state.phaseState as DistributingState;
          phaseState.pieceStartTime = +new Date("2021-02-28T15:54:19+0000");
          phaseState.distributor = 3;
          phaseState.toDistribute = [[52, 7], [18], [2], [9]];
          state.players[1].tempSpace[0][0] = 25;
          state.players[1].recentReceives = [{ piece: 25, fromPlayerName: "" }];
        },
      ),
    );
    test(
      "only most recent receive is kept during distribution",
      makeReducerTest(
        (state) => {
          state.phaseState = {
            phase: Phase.Distributing,
            pieceStartTime: +new Date("2021-02-28T15:54:14+0000"),
            distributor: 2,
            toDistribute: [[52, 7], [18], [2, 25], [9]],
            totalToDistribute: 8,
          };
          state.users.push({ id: "user-abc", player: 2 });
          state.players[2].name = "player-abc";
          state.players[2].recentReceives = [
            { piece: 5, fromPlayerName: "test" },
          ];
          state.players[1].recentReceives = [
            { piece: 11, fromPlayerName: "test" },
          ];
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 25,
          toPlayer: 1,
        },
        (state) => {
          const phaseState = state.phaseState as DistributingState;
          phaseState.pieceStartTime = +new Date("2021-02-28T15:54:19+0000");
          phaseState.distributor = 3;
          phaseState.toDistribute = [[52, 7], [18], [2], [9]];
          state.players[1].tempSpace[0][0] = 25;
          state.players[1].recentReceives = [
            { piece: 25, fromPlayerName: "player-abc" },
          ];
        },
      ),
    );
    test(
      "giving a piece to yourself",
      makeReducerTest(
        (state) => {
          state.phaseState = {
            phase: Phase.Distributing,
            pieceStartTime: +new Date("2021-02-28T15:54:14+0000"),
            distributor: 2,
            toDistribute: [[52, 7], [18], [2, 25], [9]],
            totalToDistribute: 8,
          };
          state.users.push({ id: "user-abc", player: 2 });
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 25,
          toPlayer: 2,
        },
        (state) => {
          const phaseState = state.phaseState as DistributingState;
          phaseState.pieceStartTime = +new Date("2021-02-28T15:54:19+0000");
          phaseState.distributor = 3;
          phaseState.toDistribute = [[52, 7], [18], [2], [9]];
          state.players[2].tempSpace[0][0] = 25;
        },
      ),
    );
    test(
      "trying to give piece from right queue, but in wrong order",
      makeReducerErrorTest(
        (state) => {
          state.phaseState = {
            phase: Phase.Distributing,
            pieceStartTime: +new Date("2021-02-28T15:54:14+0000"),
            distributor: 2,
            toDistribute: [[52, 7], [18], [2, 25], [9]],
            totalToDistribute: 8,
          };
          state.users.push({ id: "user-abc", player: 2 });
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 2,
          toPlayer: 1,
        },
        /according to the.* queue/,
      ),
    );
    test(
      "trying to give piece when it's not your turn",
      makeReducerErrorTest(
        (state) => {
          state.phaseState = {
            phase: Phase.Distributing,
            pieceStartTime: +new Date("2021-02-28T15:54:14+0000"),
            distributor: 2,
            toDistribute: [[52, 7], [18], [2, 25], [9]],
            totalToDistribute: 8,
          };
          state.users.push({ id: "user-abc", player: 0 });
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 7,
          toPlayer: 1,
        },
        /not currently the distributor/,
      ),
    );
    test(
      "skip players who have nothing to distribute",
      makeReducerTest(
        (state) => {
          state.phaseState = {
            phase: Phase.Distributing,
            pieceStartTime: +new Date("2021-02-28T15:54:14+0000"),
            distributor: 2,
            toDistribute: [[52, 7], [18], [2, 25], []],
            totalToDistribute: 8,
          };
          state.users.push({ id: "user-abc", player: 2 });
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 25,
          toPlayer: 1,
        },
        (state) => {
          const phaseState = state.phaseState as DistributingState;
          phaseState.pieceStartTime = +new Date("2021-02-28T15:54:19+0000");
          phaseState.distributor = 0;
          phaseState.toDistribute = [[52, 7], [18], [2], []];
          state.players[1].tempSpace[0][0] = 25;
          state.players[1].recentReceives = [{ piece: 25, fromPlayerName: "" }];
        },
      ),
    );
    test(
      "stay on the same player if they are the only one with pieces",
      makeReducerTest(
        (state) => {
          state.phaseState = {
            phase: Phase.Distributing,
            pieceStartTime: +new Date("2021-02-28T15:54:14+0000"),
            distributor: 2,
            toDistribute: [[], [], [2, 25], []],
            totalToDistribute: 8,
          };
          state.users.push({ id: "user-abc", player: 2 });
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 25,
          toPlayer: 1,
        },
        (state) => {
          const phaseState = state.phaseState as DistributingState;
          phaseState.pieceStartTime = +new Date("2021-02-28T15:54:19+0000");
          phaseState.distributor = 2;
          phaseState.toDistribute = [[], [], [2], []];
          state.players[1].tempSpace[0][0] = 25;
          state.players[1].recentReceives = [{ piece: 25, fromPlayerName: "" }];
        },
      ),
    );
    test(
      "start the game once all pieces are distributed",
      makeReducerTest(
        (state) => {
          state.phaseState = {
            phase: Phase.Distributing,
            pieceStartTime: +new Date("2021-02-28T15:54:14+0000"),
            distributor: 2,
            toDistribute: [[], [], [7], []],
            totalToDistribute: 8,
          };
          state.players[1].recentReceives = [
            { piece: 25, fromPlayerName: "bla" },
          ];
          state.players[2].recentReceives = [
            { piece: 11, fromPlayerName: "test" },
          ];
          state.players[2].recentReceives = [
            { piece: 13, fromPlayerName: "test" },
            { piece: 12, fromPlayerName: "test" },
          ];
          state.users.push({ id: "user-abc", player: 2 });
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 7,
          toPlayer: 1,
        },
        (state) => {
          state.players[1].tempSpace[0][0] = 7;
          // recentReceives are cleared when the game starts, except the very last one that occurred
          state.players[1].recentReceives = [{ piece: 7, fromPlayerName: "" }];
          state.players[2].recentReceives = [];
          state.players[3].recentReceives = [];
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:19+0000"),
            numberOfSwaps: 0,
          };
        },
      ),
    );
    test(
      "typical give during solving (from main grid)",
      makeReducerTest(
        (state) => {
          const t = state.solution.pieces;
          t[0][0] = 5;
          t[2][8] = 12;
          t[4][6] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.players[1].tempSpace[0][0] = 8;
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 17,
          toPlayer: 1,
        },
        (state) => {
          const phaseState = state.phaseState as SolvingState;
          phaseState.numberOfSwaps++;
          state.solution.pieces[4][6] = null;
          state.players[1].tempSpace[0][1] = 17;
          state.players[1].recentReceives = [{ piece: 17, fromPlayerName: "" }];
        },
      ),
    );
    test(
      "typical give during solving (from temp grid)",
      makeReducerTest(
        (state) => {
          state.solution.pieces[2][8] = 12;
          state.users.push({ id: "user-abc", player: 2 });
          state.players[1].tempSpace[0][0] = 8;
          state.players[1].recentReceives = [
            { piece: 24, fromPlayerName: "testing" },
          ];
          state.players[2].tempSpace[2][7] = 17;
          state.players[2].recentReceives = [
            { piece: 5, fromPlayerName: "bla" },
          ];
          state.players[2].name = "player-abc";
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 17,
          toPlayer: 1,
        },
        (state) => {
          const phaseState = state.phaseState as SolvingState;
          phaseState.numberOfSwaps++;
          state.players[2].tempSpace[2][7] = null;
          state.players[1].tempSpace[0][1] = 17;
          state.players[1].recentReceives.push({
            piece: 17,
            fromPlayerName: "player-abc",
          });
        },
      ),
    );
    test(
      "give during solving maintains recentlyReceived",
      makeReducerTest(
        (state) => {
          const t = state.solution.pieces;
          t[0][0] = 5;
          t[2][8] = 12;
          t[4][6] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.players[1].tempSpace[0][0] = 8;
          state.players[2].recentReceives = [
            { piece: 18, fromPlayerName: "bla" },
            { piece: 17, fromPlayerName: "bla" },
            { piece: 13, fromPlayerName: "bla" },
          ];
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 17,
          toPlayer: 1,
        },
        (state) => {
          const phaseState = state.phaseState as SolvingState;
          phaseState.numberOfSwaps++;
          state.solution.pieces[4][6] = null;
          state.players[1].tempSpace[0][1] = 17;
          state.players[1].recentReceives = [{ piece: 17, fromPlayerName: "" }];
          state.players[2].recentReceives = [
            { piece: 18, fromPlayerName: "bla" },
            { piece: 13, fromPlayerName: "bla" },
          ];
        },
      ),
    );
    test(
      "can't give to yourself during solving",
      makeReducerErrorTest(
        (state) => {
          const t = state.solution.pieces;
          t[0][0] = 5;
          t[2][8] = 12;
          t[4][6] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 17,
          toPlayer: 2,
        },
        /to yourself/,
      ),
    );
    test(
      "can't give a piece you don't own",
      makeReducerErrorTest(
        (state) => {
          const t = state.solution.pieces;
          t[0][0] = 5;
          t[2][8] = 12;
          t[4][8] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 17,
          toPlayer: 1,
        },
        /piece is not owned/,
      ),
    );
    test(
      "can't give a piece that doesn't exist",
      makeReducerErrorTest(
        (state) => {
          const t = state.solution.pieces;
          t[0][0] = 5;
          t[2][8] = 12;
          t[4][6] = 15;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.GivePiece,
          userId: "user-abc",
          now: +new Date("2021-02-28T15:54:19+0000"),
          piece: 17,
          toPlayer: 1,
        },
        /not found/,
      ),
    );
    test("go to PostGame if all finished", () => {
      let state = makeInitialState(
        { width: 4, height: 4 },
        { width: 2, height: 2 },
        4,
      );
      state.users.push({ id: "user-abc", player: 0 });
      state.phaseState = {
        phase: Phase.Solving,
        startTime: +new Date("2021-02-28T15:54:14+0000"),
        numberOfSwaps: 5,
      };
      state.solution.pieces = state.solution.pieces.map((row, i) =>
        row.map((el, j) => i * 4 + j),
      );
      for (const p of state.players) {
        p.tempSpace = p.tempSpace.map((row) => row.map(() => null));
      }

      state.solution.pieces[0][0] = null;
      state.players[0].tempSpace[0][0] = 0;

      state.solution.pieces[0][1] = null;
      state.players[0].tempSpace[0][1] = 1;

      state = reducer(state, {
        type: ActionType.PlacePiece,
        userId: "user-abc",
        piece: 1,
        target: {
          type: MoveDestinationType.Grid,
          grid: GridName.Main,
          location: { row: 0, column: 1 },
        },
      });
      expect(state.players.map((p) => p.finished)).toEqual([
        false,
        true,
        true,
        true,
      ]);

      state = reducer(state, {
        type: ActionType.PlacePiece,
        userId: "user-abc",
        piece: 0,
        target: {
          type: MoveDestinationType.Grid,
          grid: GridName.Main,
          location: { row: 0, column: 0 },
        },
      });
      expect(state.players.map((p) => p.finished)).toEqual([
        true,
        true,
        true,
        true,
      ]);
      expect(state.phaseState.phase).toEqual(Phase.PostGame);
    });
  });

  describe("PlacePiece", () => {
    test(
      "move in own temp area (typical)",
      makeReducerTest(
        (state) => {
          const t = state.players[2].tempSpace;
          t[0][0] = 5;
          t[2][7] = 12;
          t[2][8] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Temp,
            location: { row: 0, column: 3 },
          },
        },
        (state) => {
          const t = state.players[2].tempSpace;
          t[2][8] = null;
          t[0][3] = 17;
        },
      ),
    );
    test(
      "move in own temp area (same location as initial)",
      makeReducerTest(
        (state) => {
          const t = state.players[2].tempSpace;
          t[0][0] = 5;
          t[2][7] = 12;
          t[2][8] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Temp,
            location: { row: 2, column: 8 },
          },
        },
        (state) => {},
      ),
    );
    test(
      "move in own temp area (swap)",
      makeReducerTest(
        (state) => {
          const t = state.players[2].tempSpace;
          t[0][0] = 5;
          t[2][7] = 12;
          t[2][8] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Temp,
            location: { row: 2, column: 7 },
          },
        },
        (state) => {
          const t = state.players[2].tempSpace;
          t[2][7] = 17;
          t[2][8] = 12;
        },
      ),
    );
    test(
      "move in main grid (normal)",
      makeReducerTest(
        (state) => {
          const t = state.solution.pieces;
          t[0][0] = 5;
          t[2][8] = 12;
          t[4][6] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Main,
            location: { row: 5, column: 6 },
          },
        },
        (state) => {
          const t = state.solution.pieces;
          t[4][6] = null;
          t[5][6] = 17;
        },
      ),
    );
    test(
      "move in main grid (swap)",
      makeReducerTest(
        (state) => {
          const t = state.solution.pieces;
          t[0][0] = 5;
          t[2][8] = 12;
          t[4][6] = 17;
          t[5][5] = 11;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Main,
            location: { row: 5, column: 5 },
          },
        },
        (state) => {
          const t = state.solution.pieces;
          t[5][5] = 17;
          t[4][6] = 11;
        },
      ),
    );
    test(
      "move from main grid to temp (normal)",
      makeReducerTest(
        (state) => {
          const t = state.solution.pieces;
          t[0][0] = 5;
          t[2][8] = 12;
          t[4][6] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Temp,
            location: { row: 2, column: 8 },
          },
        },
        (state) => {
          state.solution.pieces[4][6] = null;
          state.players[2].tempSpace[2][8] = 17;
        },
      ),
    );
    test(
      "move from main grid to temp (swap)",
      makeReducerTest(
        (state) => {
          const t = state.solution.pieces;
          t[0][0] = 5;
          t[2][8] = 12;
          t[4][6] = 17;
          state.players[2].tempSpace[2][4] = 8;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Temp,
            location: { row: 2, column: 4 },
          },
        },
        (state) => {
          state.solution.pieces[4][6] = 8;
          state.players[2].tempSpace[2][4] = 17;
        },
      ),
    );
    test(
      "move from temp grid to main (normal)",
      makeReducerTest(
        (state) => {
          const t = state.players[2].tempSpace;
          t[0][0] = 5;
          t[2][7] = 12;
          t[2][8] = 17;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Main,
            location: { row: 5, column: 6 },
          },
        },
        (state) => {
          state.players[2].tempSpace[2][8] = null;
          state.solution.pieces[5][6] = 17;
        },
      ),
    );
    test(
      "move from temp grid to main (swap)",
      makeReducerTest(
        (state) => {
          const t = state.players[2].tempSpace;
          t[0][0] = 5;
          t[2][7] = 12;
          t[2][8] = 17;
          state.solution.pieces[5][6] = 9;
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Main,
            location: { row: 5, column: 6 },
          },
        },
        (state) => {
          state.players[2].tempSpace[2][8] = 9;
          state.solution.pieces[5][6] = 17;
        },
      ),
    );
    test(
      "moving a piece removes it from recentReceives",
      makeReducerTest(
        (state) => {
          const t = state.players[2].tempSpace;
          t[0][0] = 5;
          t[2][7] = 12;
          t[2][8] = 17;
          state.players[1].recentReceives = [
            { piece: 8, fromPlayerName: "testing" },
          ];
          state.players[2].recentReceives = [
            { piece: 17, fromPlayerName: "bla" },
            { piece: 9, fromPlayerName: "bla" },
            { piece: 12, fromPlayerName: "bla" },
          ];
          state.users.push({ id: "user-abc", player: 2 });
          state.phaseState = {
            phase: Phase.Solving,
            startTime: +new Date("2021-02-28T15:54:14+0000"),
            numberOfSwaps: 5,
          };
        },
        {
          type: ActionType.PlacePiece,
          userId: "user-abc",
          piece: 17,
          target: {
            type: MoveDestinationType.Grid,
            grid: GridName.Temp,
            location: { row: 2, column: 7 },
          },
        },
        (state) => {
          const t = state.players[2].tempSpace;
          t[2][7] = 17;
          t[2][8] = 12;
          state.players[2].recentReceives = [
            { piece: 9, fromPlayerName: "bla" },
          ];
        },
      ),
    );
  });
  describe("ChangeGameSettings", () => {
    test(
      "not allowed to change settings in Phase.Distribting",
      makeReducerErrorTest(
        (state) => {
          state.phaseState.phase = Phase.Distributing;
        },
        {
          type: ActionType.ChangeSettings,
          userId: "user-abc",
          settings: {},
        },
        /can only be used in Phase.PreGame/,
      ),
    );
    test(
      "not allowed to change settings in Phase.Solving",
      makeReducerErrorTest(
        (state) => {
          state.phaseState.phase = Phase.Solving;
        },
        {
          type: ActionType.ChangeSettings,
          userId: "user-abc",
          settings: {},
        },
        /can only be used in Phase.PreGame/,
      ),
    );
    test(
      "not allowed to change settings in Phase.PreGame",
      makeReducerTest(
        (state) => {
          state.phaseState.phase = Phase.PreGame;
          state.gameSettings.roughNumberOfTiles = NumberOfTiles.Many;
        },
        {
          type: ActionType.ChangeSettings,
          userId: "user-abc",
          settings: {
            image: { url: "a", width: 1, height: 2 },
            distributionTime: DistributionTime.Long,
          },
        },
        (state) => {
          state.gameSettings = {
            image: { url: "a", width: 1, height: 2 },
            distributionTime: DistributionTime.Long,
            roughNumberOfTiles: NumberOfTiles.Many,
            enableImagePreview: false,
          };
        },
      ),
    );
  });
});
