FROM node:16

WORKDIR /usr/src/app
COPY packages/client ./

RUN npm ci
ENV NODE_ENV=production
RUN npm run build

CMD [ "npm", "start" ]