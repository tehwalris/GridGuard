# MULTIPLAYER-PUZZLE

MULTIPLAYER-PUZZLE (name is WIP) is a multiplayer jigsaw puzzle game requiring good communication on top of good puzzle skills. The prototype was built by [Marc Bitterli](https://github.com/N3XT191) and me on a single Sunday and we're currently working on improving it.

It is built with the same backend and structure of my previous project [Vertiled](https://github.com/tehwalris/vertiled).

## Demo

There is no live Demo available right now.

## Controls

During the solving-phase of the puzzle, puzzle pieces can be moved and shared using click&place. A future upgrade to drag&drop is in consideration.

## Gameplay

Currently, the game works only with 4 players. After all players are connected and every player has chosen a section of the puzzle to solve, each player is assigned ~75% of the pieces required to complete their section. The rest of the pieces are shuffled and in turn a player is given a piece and they have to decide who they want to give the piece to. Since players only see their own pieces (and the distributing player is the only one to see that piece), the players need to communicate clearly what the piece looks like and to whom it likely belongs.

After all pieces are distributed, each player has to complete their section of the puzzle. Any wrongly distributed piece can still be exchanged with other players, which incurs a time-penalty.

The goal of the game is to finish the whole puzzle as quickly as possible.

## Getting started

### Initial setup

You will need to install [Node.js](https://nodejs.org) (we used v15) and [Yarn](https://yarnpkg.com/) (v1) on your system.

### Running for development

Start the following commands, with each line in a separate terminal:

```bash
cd gl-tiled && yarn watch
cd vertiled-shared && yarn build --watch
cd vertiled-server && yarn build --watch
cd vertiled-server && nodemon -w dist dist/index.js
cd vertiled-client && yarn start
```

This will start the frontend (most likely) on [localhost:3000](localhost:3000) and the server on [localhost:8088](localhost:8088).

### Running in production

**This project is not for serious public deployments**. It is suitable to have fun with some friends though. There is no access control or secure separation of users built in, so you should deploy this application only on your local network or behind a VPN. You might want to add a proxy server in front for authentication and HTTPS.

To run it locally:

```bash
yarn
yarn workspaces build
cd vertiled-server
node dist/index.js
```

or via docker:

```bash
docker build -t vertiled .
docker run -p 80:5000 vertiled:latest
```
