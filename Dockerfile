FROM node:15-alpine3.12

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY gl-tiled/package.json ./gl-tiled/
COPY puzzle-client/package.json ./puzzle-client/
COPY puzzle-server/package.json ./puzzle-server/
COPY puzzle-shared/package.json ./puzzle-shared/

RUN yarn 

COPY . .

RUN yarn workspaces run build

EXPOSE 80

WORKDIR /usr/src/app/puzzle-server

ENV PORT=80

CMD [ "node", "dist/index.js" ]



