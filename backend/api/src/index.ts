import { join } from 'path';
import * as express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { loadSchemaSync, GraphQLFileLoader, addResolversToSchema } from 'graphql-tools';
import { resolvers } from './graphql-data/resolvers/event-resolvers';
import { createMongoConnection } from './db/mongo-connection';

const schema = loadSchemaSync(join(__dirname, 'graphql-data', 'schemas', '*.graphql'), {
  loaders: [
    new GraphQLFileLoader(),
  ]
});
const schemaResolvers = addResolversToSchema({ schema, resolvers });

const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use('/graphql', graphqlHTTP({
  schema: schemaResolvers,
  graphiql: true,
}));

if (process.env.NODE_ENV !== 'test') {
  createMongoConnection();
  app.listen(8089, () => console.log('Server running at http://localhost:8089'));
}

export default app;
