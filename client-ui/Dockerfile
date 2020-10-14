FROM node:12.18.4-alpine AS frontend
WORKDIR /usr/src/app/

COPY ./frontend/package*.json ./
COPY ./frontend/tsconfig*.json ./
COPY ./frontend/public ./public
COPY ./frontend/src ./src

RUN npm install
RUN npm run build

FROM node:12.18.4-alpine
WORKDIR /usr/src/app/

COPY --from=frontend /usr/src/app/build ./build
COPY ./backend/package*.json ./
COPY ./backend/tsconfig*.json ./
COPY ./backend/src ./src

RUN npm install
RUN npm run build

EXPOSE 8080
CMD [ "npm", "start" ]
