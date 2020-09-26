import { join } from 'path';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { loadSchemaSync, GraphQLFileLoader, addResolversToSchema } from 'graphql-tools';
import { resolvers } from './graphql-data/resolvers/resolvers';
import db, { createMongoConnection } from './db/mongo-connection';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

passport.use(new BearerStrategy(async (token, done) => {
    const user = await db.getUserByToken(token);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  }
))

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

app.use('/graphql', passport.authenticate('bearer', {session: false}), graphqlHTTP({
  schema: schemaResolvers,
  graphiql: true,
}));

if (process.env.NODE_ENV !== 'test') {
  createMongoConnection();
  app.listen(process.env.PORT, () => console.log(`Server running at http://localhost:${process.env.PORT}`));
}

export default app;
