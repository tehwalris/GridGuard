# GridGuard

## Getting started

### Initial setup

You will need to install [Node.js](https://nodejs.org) (we used v18) and [Yarn](https://yarnpkg.com/) (v1) on your system.

### Running for development

Start the following commands, with each line in a separate terminal:

```bash
cd power-shared && yarn build --watch
cd power-server && yarn build --watch
cd power-server && npx nodemon -w ../power-shared/dist/ -w dist dist/index.js
cd power-client && yarn start
```

This will start the frontend (most likely) on [localhost:3000](localhost:3000) and the server on [localhost:8088](localhost:8088).
