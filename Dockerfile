FROM node:12-alpine

WORKDIR /migrations

COPY index.js index.js
COPY smConnector.js smConnector.js
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY knexfile.js knexfile.js

RUN cd /migrations
RUN npm ci

ENTRYPOINT ["/usr/local/bin/node", "index.js"]
CMD ["migrate"]
