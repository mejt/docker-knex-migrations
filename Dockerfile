FROM node:12-alpine

WORKDIR /migrations

ADD package.json package.json
ADD package-lock.json package-lock.json

RUN cd /migrations && npm ci

ADD index.js index.js
ADD smConnector.js smConnector.js

ENTRYPOINT ["/usr/local/bin/node", "index.js"]
CMD ["migrate"]
