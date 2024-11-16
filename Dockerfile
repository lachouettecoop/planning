FROM node:16-alpine AS builder

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile && yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
