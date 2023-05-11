FROM node:16 AS client

WORKDIR /usr/src/app
COPY packages/client ./

RUN npm ci
ENV NODE_ENV=production
RUN npm run build

FROM nginx:latest

WORKDIR /data/www
COPY --from=client /usr/src/app/dist ./client
COPY ./configs/nginx.conf /etc/nginx/conf.d/default.conf
