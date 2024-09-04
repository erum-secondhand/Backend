FROM node:18-alpine

RUN apk add --no-cache bash

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g ts-node nodemon

COPY wait-for-it.sh /usr/wait-for-it.sh

RUN chmod +x /usr/wait-for-it.sh

COPY . .

EXPOSE 8080

ENV NODE_OPTIONS="--loader ts-node/esm --experimental-specifier-resolution=node"
ENV TS_NODE_PROJECT="./tsconfig.json"
ENV TS_NODE_FILES=true

CMD ["nodemon", "--exec", "ts-node", "src/main.ts"]