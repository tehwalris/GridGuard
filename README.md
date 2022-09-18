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

Our prototype simulates a smart grid with thousands of connected devices. Most of these devices are virtual, but one of them exists in the real world. The values shown in our web app are updated in real-time.

- `DeviceServer` (power-shared/src/device.ts)
  - Actually runs the simulated smart grid
  - Sends power saving requests to individual connected devices (`DeviceClient`) in response to toggle changes
  - Receives current power usage stats for every connected device
- `SometimesOnDeviceClient` (power-shared/src/device.ts)
  - An instance for each of the 100000 individual smart devices connected to our simulated grid
  - Sends and receives messages with `DeviceServer`
- `power-server` (power-server/src/index.ts)
  - Hosts the master version of the current control panel state
  - Pushes info about devices from `DeviceServer` into the control panel state (`reducer`) on every tick
    - Detailed info for a subset (500) of the devices (for performance reasons)
    - Aggregate power usage for all 100000 devices
- `power-client` (power-client/src/index.ts)
  - The web app which is used by both normal users and admins
  - Synchronizes control panel state from `power-server`
  - Sends toggle changes to `power-server`
  - Sends the "power plant goes offline" event to `power-server` for our demo
- `reducer` (power-shared/src/reducer.ts)
  - Describes how the control panel state is updated
- `smart-device` (microwave/smart-device.cpp)
  - ESP32/Arduino code that runs our "real" microwave
  - Connected to `DeviceServer` through `bridge`
- `bridge` (power-server/src/bridge.ts)
  - Interfaces between physical smart devices (the microwave `smart-device`) and `DeviceServer`
  - Controls one specific `SometimesOnDeviceClient` representing the real microwave

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
