import { Draft, produce } from "immer";
import { Action, ActionType } from "../interfaces/action";
import { State } from "../interfaces/state";
import { makeInitialState, reducer } from "../reducer";

describe("reducer", () => {
  function makeReducerTest(
    modifyInputState: (state: State) => void,
    action: Action,
    modifyAsExpected: (state: Draft<State>) => void,
  ) {
    return () => {
      const inputState = makeInitialState();
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
      const inputState = makeInitialState();
      modifyInputState(inputState);
      expect(() => reducer(inputState, action)).toThrowError(expectedError);
    };
  }

  describe("AddUser", () => {
    test(
      "add user",
      makeReducerTest(
        () => {},
        {
          type: ActionType.AddUser,
          userId: "someId",
        },
        (state) => {
          state.users.push({ id: "someId" });
        },
      ),
    );
  });
});
