FROM node:14.17.0-alpine as backend
WORKDIR /usr/src/app/

COPY ./package*.json ./
COPY ./tsconfig*.json ./
COPY ./src ./src

RUN npm install
RUN npm run build

# Final build
FROM node:14.17.0-alpine
WORKDIR /usr/src/app/

COPY --from=backend /usr/src/app/dist ./dist
COPY --from=backend /usr/src/app/node_modules ./node_modules
COPY ./package.json ./

ENV PORT=8080

EXPOSE 8080
CMD [ "npm", "start" ]
