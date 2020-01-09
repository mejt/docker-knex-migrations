FROM node:12-alpine

WORKDIR /app

ADD package.json package.json
ADD package-lock.json package-lock.json

RUN cd /app && npm ci

ADD index.js index.js
ADD smConnector.js smConnector.js

ENTRYPOINT ["/usr/local/bin/node", "index.js"]
CMD ["migrate"]
