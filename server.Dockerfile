FROM node:16

WORKDIR /usr/src/app/server
COPY packages/server/. .
COPY tsconfig.json /usr/src/

RUN npm ci
ENV NODE_ENV=production
RUN npm run build

USER node
CMD ["node", "./dist/index.js"]