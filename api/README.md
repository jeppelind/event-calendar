# GraphQL API

ExpressJS server hosting a GraphQL api with a MongoDB wrapper against the event database.
Redis is used to cache the results.

## Commands
`npm run build` - Build project.

`npm start` - Start built server.

`npm run start:dev` - Run test and start up server from source files.

`npm run coverage` - Get info on amount of code covered by test.

## Environmental settings
PORT - port to run on
MONGODB_TEST_URI - mongodb test server
MONGODB_URI - mongodb prod server
TEST_AUTH_TOKEN - Authorization token for testing. Ex Bearer TEST
REDIS_HOST - Name of Redis host (use localhost locally, service name in k8s)
CACHE_EXPIRATION - Cache expiration in seconds (Dockerfile defaults to 4 hours)
