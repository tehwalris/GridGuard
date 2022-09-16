import { checkFinishedPlayers, makeInitialState } from "../reducer";

describe("checkFinishedPlayers", () => {
  test("initial state", () => {
    const initialState = makeInitialState(
      { width: 14, height: 8 },
      { width: 12, height: 3 },
      4,
    );
    const finished = checkFinishedPlayers(initialState);
    expect(finished).toEqual([false, false, false, false]);
  });
  test("check single finished player", () => {
    const state = makeInitialState(
      { width: 4, height: 4 },
      { width: 2, height: 2 },
      4,
    );
    state.solution.pieces[0][0] = 0;
    state.solution.pieces[0][1] = 1;
    state.solution.pieces[1][0] = 4;
    state.solution.pieces[1][1] = 5;
    state.players[0].tempSpace.map((v) => null);

    const finished = checkFinishedPlayers(state);
    expect(finished).toEqual([true, false, false, false]);
  });
  test("check all finished player", () => {
    const state = makeInitialState(
      { width: 4, height: 4 },
      { width: 2, height: 2 },
      4,
    );
    state.solution.pieces = state.solution.pieces.map((row, i) =>
      row.map((el, j) => i * 4 + j),
    );
    for (const p of state.players) {
      p.tempSpace = p.tempSpace.map((row) => row.map(() => null));
    }

    const finished = checkFinishedPlayers(state);
    expect(finished).toEqual([true, true, true, true]);
  });
});
