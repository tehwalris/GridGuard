import assert from "assert";
import { current as immerCurrent, produce } from "immer";
import Prando from "prando";
import * as R from "ramda";
import { numberOfPiecesBounds, tempSpaceSizes } from "./constants";
import { findTileSizes } from "./find-tile-sizes";
import {
  getAllPieceLocations,
  placePiecesWhereEmpty,
  replacePieceAtLocation,
} from "./grid-utils";
import {
  Action,
  ActionType,
  GridDestination,
  GridName,
  MoveDestinationType,
} from "./interfaces/action";
import {
  DistributionTime,
  GridSize,
  ImageWithSize,
  NumberOfTiles,
  Phase,
  Player,
  State,
  User,
} from "./interfaces/state";
import { LocalGridIndexer } from "./local-grid-indexer";
import { unreachable } from "./util";

function makeCoreState(
  puzzleSize: GridSize,
  tempSize: GridSize,
  numPlayers: number,
  image: ImageWithSize,
): Pick<State, "puzzleDefinition" | "solution" | "players"> {
  return {
    puzzleDefinition: {
      pieces: R.times(() => ({}), puzzleSize.height * puzzleSize.width),
      size: { ...puzzleSize },
      imageURL: image.url,
      tileHeight: image.height / puzzleSize.height,
      tileWidth: image.width / puzzleSize.width,
    },
    solution: {
      pieces: R.times(
        () => R.times(() => null, puzzleSize.width),
        puzzleSize.height,
      ),
    },
    players: R.times(
      () => ({
        name: "",
        tempSpace: R.times(
          () => R.times(() => null, tempSize.width),
          tempSize.height,
        ),
        recentReceives: [],
        finished: false,
      }),
      numPlayers,
    ),
  };
}

export function makeInitialState(
  puzzleSize: GridSize,
  tempSize: GridSize,
  numPlayers: number,
): State {
  return {
    phaseState: {
      phase: Phase.PreGame,
      showImagePreviewNow: false,
    },
    gameSettings: {
      image: {
        url: "https://i.imgur.com/PuoRzgD.jpg",
        width: 840,
        height: 480,
      },
      roughNumberOfTiles: NumberOfTiles.Medium,
      distributionTime: DistributionTime.Long,
      enableImagePreview: false,
    },
    ...makeCoreState(puzzleSize, tempSize, numPlayers, {
      url: "https://i.imgur.com/PuoRzgD.jpg",
      width: 840,
      height: 480,
    }),
    users: [],
  };
}

export const initialState: State = makeInitialState(
  { height: 8, width: 14 },
  { height: 3, width: 12 },
  4,
);

function requireUser(state: State, action: { userId: string }): User {
  const user = state.users.find((u) => u.id === action.userId);
  if (!user) {
    throw new Error(`unknown user: ${action.userId}`);
  }
  return user;
}

function requirePlayer(
  state: State,
  action: { userId: string },
): [number, Player] {
  const user = requireUser(state, action);
  const iPlayer = user.player;
  const player =
    typeof iPlayer === "number" ? state.players[iPlayer] : undefined;
  if (!player) {
    throw new Error("user is not bound to a player");
  }
  return [iPlayer!, player];
}

function tryRemoveFromRecentReceives(players: Player[], piece: number) {
  for (const player of players) {
    const i = player.recentReceives.findIndex((r) => r.piece === piece);
    if (i >= 0) {
      player.recentReceives.splice(i, 1);
    }
    assert(!player.recentReceives.find((r) => r.piece === piece));
  }
}

// Modifies state in place.
// Returns the location that the piece was removed from.
// Throws if the piece does not exist.
// Throws if the piece is not owned by the specified owner.
function removeOwnedPiece(
  state: State,
  owner: number,
  piece: number,
): GridDestination {
  for (const [row, rowData] of state.players[owner].tempSpace.entries()) {
    for (let column = 0; column < rowData.length; column++) {
      if (rowData[column] === piece) {
        rowData[column] = null;
        return {
          type: MoveDestinationType.Grid,
          grid: GridName.Temp,
          location: { row, column },
        };
      }
    }
  }

  for (const [row, rowData] of state.solution.pieces.entries()) {
    for (let column = 0; column < rowData.length; column++) {
      if (rowData[column] === piece) {
        const indexer = LocalGridIndexer.forPlayer(
          state.puzzleDefinition.size,
          owner,
        );
        if (!indexer.globalToLocal({ row, column })) {
          throw new Error("piece is not owned by specified owner");
        }
        rowData[column] = null;
        return {
          type: MoveDestinationType.Grid,
          grid: GridName.Main,
          location: { row, column },
        };
      }
    }
  }

  throw new Error("piece not found");
}

function dropPiece(
  state: State,
  player: number,
  destination: GridDestination,
  piece: number,
): number | null {
  switch (destination.grid) {
    case GridName.Main: {
      const indexer = LocalGridIndexer.forPlayer(
        state.puzzleDefinition.size,
        player,
      );
      if (!indexer.globalToLocal(destination.location)) {
        throw new Error("can't place in another players area of the puzzle");
      }
      return replacePieceAtLocation(
        state.solution.pieces,
        destination.location,
        piece,
      );
    }
    case GridName.Temp: {
      return replacePieceAtLocation(
        state.players[player].tempSpace,
        destination.location,
        piece,
      );
    }
    default: {
      unreachable(destination.grid);
    }
  }
}

export const checkFinishedPlayers = (state: State) => {
  const finished = state.players.map((player, index) => {
    const indexer = LocalGridIndexer.forPlayer(
      state.puzzleDefinition.size,
      index,
    );
    const solutionGrid = indexer.extractLocal(state.solution.pieces);
    const correctPieces = solutionGrid.flatMap((row, i) =>
      row.map((el, j) => {
        const loc = indexer.localToGlobal({ row: i, column: j });
        return loc.row * state.puzzleDefinition.size.width + loc.column === el;
      }),
    );
    const finished =
      !correctPieces.includes(false) &&
      player.tempSpace.flat().every((e) => e === null);
    return finished;
  });
  return finished;
};

export const reducer = (_state: State, action: Action): State =>
  produce(_state, (state) => {
    switch (action.type) {
      case ActionType.JoinAsPlayer: {
        const user = requireUser(state, action);
        user.player = action.player;
        state.players[action.player].name = action.name;
        break;
      }
      case ActionType.ShowImagePreviewNow: {
        if (state.phaseState.phase !== Phase.PreGame) {
          throw new Error("game is already started");
        }
        state.phaseState.showImagePreviewNow = true;
        break;
      }
      case ActionType.StartGame: {
        if (state.phaseState.phase !== Phase.PreGame) {
          throw new Error("game is already started");
        }

        if (!Number.isSafeInteger(action.seed)) {
          throw new Error("seed must be an integer");
        }
        const rng = new Prando(action.seed);

        const size = findTileSizes(
          state.gameSettings.image,
          numberOfPiecesBounds[state.gameSettings.roughNumberOfTiles].low,
          numberOfPiecesBounds[state.gameSettings.roughNumberOfTiles].high,
        );
        const { puzzleDefinition, solution, players } = makeCoreState(
          size,
          tempSpaceSizes[state.gameSettings.roughNumberOfTiles],
          4,
          state.gameSettings.image,
        );

        state.puzzleDefinition = puzzleDefinition;
        state.solution = solution;
        state.players = state.players.map((p, index) => ({
          ...p,
          tempSpace: players[index].tempSpace,
        }));

        const globalSize = state.puzzleDefinition.size;
        const indexersByPlayer = state.players.map((player, i_player) =>
          LocalGridIndexer.forPlayer(globalSize, i_player),
        );

        const allPiecesShuffled = getAllPieceLocations(
          globalSize,
        ).map((location, i) => ({ i, location, priority: rng.next() }));
        allPiecesShuffled.sort((a, b) => a.priority - b.priority);

        const piecesByPlayer = indexersByPlayer.map((indexer) => {
          const shuffledPiecesThisPlayer = allPiecesShuffled
            .filter(({ location }) => indexer.globalToLocal(location))
            .map(({ i }) => i);
          const directlyAssignedCount = Math.round(
            shuffledPiecesThisPlayer.length * 0.75,
          );
          return {
            directlyAssignedToThis: shuffledPiecesThisPlayer.slice(
              0,
              directlyAssignedCount,
            ),
            randomlyDistributedFromThis: shuffledPiecesThisPlayer.slice(
              directlyAssignedCount,
            ),
          };
        });

        const allRandomPieces = R.flatten(
          piecesByPlayer.map((pieces) => pieces.randomlyDistributedFromThis),
        ).map((location, i) => ({ i, location, priority: rng.next() }));

        const allRandomPiecesShuffled = allRandomPieces
          .sort((a, b) => a.priority - b.priority)
          .map((e) => e.location);

        const randomlyAssignedPiecesByPlayer = state.players.map(
          (player, i_player) =>
            allRandomPiecesShuffled.filter(
              (piece, i_random) => i_random % state.players.length === i_player,
            ),
        );

        for (const [i, player] of state.players.entries()) {
          player.tempSpace = placePiecesWhereEmpty(
            player.tempSpace,
            piecesByPlayer[i].directlyAssignedToThis,
          );
        }

        state.phaseState = {
          phase: Phase.Distributing,
          pieceStartTime: action.now,
          distributor: rng.nextInt(0, state.players.length - 1),
          toDistribute: randomlyAssignedPiecesByPlayer,
          totalToDistribute: allRandomPieces.length,
        };
        break;
      }
      case ActionType.GivePiece: {
        if (
          state.phaseState.phase !== Phase.Distributing &&
          state.phaseState.phase !== Phase.Solving
        ) {
          throw new Error("can not use GivePiece in this phase");
        }

        if (
          !Number.isSafeInteger(action.toPlayer) ||
          action.toPlayer < 0 ||
          action.toPlayer >= state.players.length
        ) {
          throw new Error("toPlayer is not valid");
        }
        const toPlayer = state.players[action.toPlayer];

        const [iFromPlayer, fromPlayer] = requirePlayer(state, action);

        toPlayer.tempSpace = placePiecesWhereEmpty(toPlayer.tempSpace, [
          action.piece,
        ]);

        if (state.phaseState.phase === Phase.Solving) {
          if (iFromPlayer === action.toPlayer) {
            throw new Error("can't give a piece to yourself");
          }
          removeOwnedPiece(state, iFromPlayer, action.piece);
          state.phaseState.numberOfSwaps++;
        } else {
          if (state.phaseState.distributor !== iFromPlayer) {
            throw new Error(
              `player ${iFromPlayer} is not currently the distributor`,
            );
          }

          if (
            state.phaseState.toDistribute[iFromPlayer].pop() !== action.piece
          ) {
            throw new Error(
              "must distribute pieces according to the distribution queue",
            );
          }
          state.phaseState.pieceStartTime = action.now;
          for (let i = 1; i < state.players.length; i++) {
            const iNewDistributor =
              (state.phaseState.distributor + i) % state.players.length;
            if (state.phaseState.toDistribute[iNewDistributor].length) {
              state.phaseState.distributor = iNewDistributor;
              break;
            }
          }

          if (state.phaseState.toDistribute.every((arr) => !arr.length)) {
            for (const player of state.players) {
              player.recentReceives = [];
            }
            state.phaseState = {
              phase: Phase.Solving,
              startTime: action.now,
              numberOfSwaps: 0,
            };
          }

          toPlayer.recentReceives = [];
        }

        tryRemoveFromRecentReceives(state.players, action.piece);
        if (action.toPlayer !== iFromPlayer) {
          toPlayer.recentReceives.push({
            piece: action.piece,
            fromPlayerName: fromPlayer.name,
          });
        }
        if (state.phaseState.phase === Phase.Solving) {
          const finishedPlayers = checkFinishedPlayers(immerCurrent(state));
          state.players = state.players.map((p, index) => ({
            ...p,
            finished: finishedPlayers[index],
          }));
          if (finishedPlayers.every((val) => val)) {
            state.phaseState = {
              phase: Phase.PostGame,
              numberOfSwaps: state.phaseState.numberOfSwaps,
              totalGameTime: Math.round(
                (Date.now() - state.phaseState.startTime) / 1000,
              ),
            };
          }
        }

        break;
      }
      case ActionType.PlacePiece: {
        if (state.phaseState.phase !== Phase.Solving) {
          throw new Error("PlacePiece can only be used in Phase.Solving");
        }

        const [iFromPlayer] = requirePlayer(state, action);
        const source = removeOwnedPiece(state, iFromPlayer, action.piece);
        const replacedPiece = dropPiece(
          state,
          iFromPlayer,
          action.target,
          action.piece,
        );
        if (replacedPiece !== null) {
          dropPiece(state, iFromPlayer, source, replacedPiece);
          tryRemoveFromRecentReceives(state.players, replacedPiece);
        }

        tryRemoveFromRecentReceives(state.players, action.piece);

        if (state.phaseState.phase === Phase.Solving) {
          const finishedPlayers = checkFinishedPlayers(immerCurrent(state));
          state.players = state.players.map((p, index) => ({
            ...p,
            finished: finishedPlayers[index],
          }));

          if (finishedPlayers.every((val) => val)) {
            state.phaseState = {
              phase: Phase.PostGame,
              numberOfSwaps: state.phaseState.numberOfSwaps,
              totalGameTime: Math.round(
                (Date.now() - state.phaseState.startTime) / 1000,
              ),
            };
          }
        }

        break;
      }
      case ActionType.ChangeSettings: {
        if (state.phaseState.phase !== Phase.PreGame) {
          throw new Error("PlacePiece can only be used in Phase.PreGame");
        }
        state.gameSettings = {
          ...state.gameSettings,
          ...action.settings,
        };

        break;
      }
      case ActionType.AddUser: {
        if (state.users.find((u) => u.id === action.userId)) {
          throw new Error(`user already exists: ${action.userId}`);
        }
        state.users.push({ id: action.userId });
        break;
      }
      case ActionType.RemoveUser: {
        state.users = state.users.filter((u) => u.id !== action.userId);
        break;
      }
      case ActionType.RestartLobby: {
        state.phaseState = { phase: Phase.PreGame, showImagePreviewNow: false };
        break;
      }
      default: {
        unreachable(action);
      }
    }
  });
