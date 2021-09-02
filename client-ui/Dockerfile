#Frontend
FROM node:14.17.0-alpine as frontend
WORKDIR /usr/src/app/

COPY ./frontend/package*.json ./
COPY ./frontend/tsconfig*.json ./
COPY ./frontend/public ./public
COPY ./frontend/craco.config.js ./
COPY ./frontend/src ./src

RUN npm install
RUN npm run build

# Backend
FROM node:14.17.0-alpine as backend
WORKDIR /usr/src/app/

# COPY --from=frontend /usr/src/app/build ./build
COPY ./backend/package*.json ./
COPY ./backend/tsconfig*.json ./
COPY ./backend/src ./src

RUN npm install
RUN npm run build

# Final build
FROM node:14.17.0-alpine
WORKDIR /usr/src/app/

COPY --from=frontend /usr/src/app/build ./build
COPY --from=backend /usr/src/app/dist ./dist
COPY --from=backend /usr/src/app/node_modules ./node_modules
COPY ./backend/package*.json ./

# RUN npm install --only=prod

ENV PORT=8080
ENV STATIC_ASSETS_PATH=../build

EXPOSE 8080
CMD [ "npm", "start" ]
