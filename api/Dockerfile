FROM node:12.18.4-alpine AS builder
WORKDIR /usr/src/app/

COPY package*.json ./
COPY tsconfig*.json ./
COPY codegen.yml ./
COPY ./src ./src

RUN npm install
RUN npm run build

FROM node:12.18.4-alpine
WORKDIR /usr/src/app/

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm install --only=prod

ENV PORT=8080
ENV CACHE_EXPIRATION=14400
ENV CACHE_PROVIDER=REDIS

EXPOSE 8080
CMD [ "npm", "start" ]
