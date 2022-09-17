# GridGuard

It’s getting increasingly likely that our electricity production won’t be enough to match our demand. If at the same time a whole power plant goes offline unexpectedly, the government will _have_ to take whole sections of our country offline to save the rest from a blackout!

This is where _GridGuard_ comes in:
_GridGuard_ puts a large swarm of private SmartDevices under a central command. This way, the government can shut off non-essential, private devices across the country at the press of a button and save us from a black-out with _minimal negative effect_ to our lives!

## Demo

_TODO_

### Pages

- `/admin`: Admin panel where the government can monitor the grid and turn devices on and off.
- `/user/home` and `/user/details`: Users see the live grid status and which (if any) devices they have are affected.
- `/visualization`: displays a selection of the virtual SmartDevices and their on/off status.
- `/event`: start and stop an "event" (reduction in electricity production like when a power plant goes offline)

## Technical Info

_TODO_

## Getting started

### Initial setup

- Clone this repo.

- install [Node.js](https://nodejs.org) (we used v16) and [Yarn](https://yarnpkg.com/) (v1.22) on your system .

### Running for development

Start the following commands, with each line in a separate terminal:

```bash
cd power-shared && yarn && yarn build --watch
cd power-server && yarn && yarn build --watch
cd power-server && yarn && node dist/index.js
cd power-client && yarn start
```

This will start the frontend (most likely) on [localhost:3000](localhost:3000) and the server on [localhost:8088](localhost:8088).
