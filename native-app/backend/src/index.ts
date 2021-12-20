import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import passport from './auth';
import { createMongoConnection } from './db-wrapper';
import { getUserData, User } from './user';

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(cors({ origin: 'http://localhost:19006' }));
}

app.use(express.json());
app.use(passport.initialize());

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/login', passport.authenticate('local', {
  session: false,
}), (req, res) => {
  res.json(getUserData(req.user as User));
});

app.post('/graphql', async (req, res) => {
  try {
    const token = req.headers.authorization || process.env.PUBLIC_TOKEN;
    const apiResponse = await fetch(`${process.env.API_URL}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query: req.body.query }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    if (!apiResponse.ok) {
      throw Error(apiResponse.statusText);
    }
    const json = await apiResponse.json();
    await new Promise((resolve) => setTimeout(resolve, 2000)); // TEST DELAY
    res.send(json);
  } catch (err) {
    res.status(500).send(err);
  }
});

if (process.env.NODE_ENV !== 'test') {
  createMongoConnection();
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
}

export default app;
