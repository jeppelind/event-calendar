import bodyParser from 'body-parser';
import express from 'express';
import { join } from 'path';
import fetch from 'node-fetch';
import cors from 'cors';
import { createMongoConnection } from './db-wrapper';
import { changeUserPassword, createNewUser, getUserData, User } from './user';
import session from 'express-session';
import { passport, authenticateUserMiddleware } from './authentication';
import Redis from 'ioredis';
import redisStore from 'connect-redis';

const RedisStore = redisStore(session);
const redis = new Redis({
  port: parseInt(process.env.REDIS_PORT, 10),
  host: process.env.REDIS_HOST
});

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(cors({ origin: 'http://localhost:3000' }));
}

app.use(express.static(join(__dirname, process.env.STATIC_ASSETS_PATH)));

app.use(bodyParser.json());
app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'prod',
    maxAge: 1000 * 60 * 60 * 24
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, process.env.STATIC_ASSETS_PATH, 'index.html'));
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/user/get'
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send();
});

app.get('/user/get', authenticateUserMiddleware, (req, res) => {
  const userData = getUserData(req.user as User);
  res.send(userData);
})

app.post('/user/add', authenticateUserMiddleware, async (req, res) => {
  try {
    const newUserId = await createNewUser(req.body.email, req.body.password, req.body.role, req.body.name);
    res.send(newUserId);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post('/user/changePassword', authenticateUserMiddleware, async (req, res) => {
  try {
    const result = await changeUserPassword(req.body.id, req.body.password, req.body.newPassword);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post('/graphql', authenticateUserMiddleware, async (req, res) => {
  try {
    const { token } = req.user as User;
    const apiRes = await fetch(`${process.env.API_URL}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query: req.body.query }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!apiRes.ok) {
      throw Error(apiRes.statusText);
    }
    const json = await apiRes.json();
    res.send(json);
  } catch (err) {
    console.error(err)
    console.log(req.body.query)
    res.status(500).send(err);
  }
})

if (process.env.NODE_ENV !== 'test') {
  createMongoConnection();
  app.listen(process.env.PORT, () => console.log(`Server runnning at http://localhost:${process.env.PORT}`));
}

export default app;
