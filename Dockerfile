FROM localhost:32001/node:20.18.2-alpine3.21 As dev-tasks
WORKDIR /usr/src/app
COPY package.json .
COPY ./.npmrc .
RUN npm install
COPY ./src .
COPY nest-cli.json .
COPY tsconfig*.json ./
RUN npm run build

FROM localhost:32001/node:20.18.2-alpine3.21 as prod-tasks
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG SWAGGER_GATEWAY=http://devbuild-srv.chargoon.net:31001
ENV SWAGGER_GATEWAY=${SWAGGER_GATEWAY}
ARG SWAGGER_SERVICE=http://devbuild-srv.chargoon.net:31001
ENV SWAGGER_SERVICE=${SWAGGER_SERVICE}
WORKDIR /usr/src/app
RUN mkdir -p ./event-store
COPY ./.npmrc .
COPY --from=dev-tasks /usr/src/app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=dev-tasks /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
