import bodyParser from 'body-parser';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import { createMongoConnection } from './db-wrapper';
import { changeUserPassword, createNewUser, getUserObject } from './user';

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(cors({ origin: 'http://localhost:3000' }));
}

app.get('/', (req, res) => {
  res.send('test site');
});

app.post('/login', bodyParser.json(), async (req, res) => {
  try {
    const user = await getUserObject(req.body.email, req.body.password);
    res.send(JSON.stringify(user));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/addUser', bodyParser.json(), async (req, res) => {
  try {
    const newUserId = await createNewUser(req.body.email, req.body.password, req.body.role, req.body.name);
    res.send(newUserId);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post('/changePassword', bodyParser.json(), async (req, res) => {
  try {
    const result = await changeUserPassword(req.body.id, req.body.password, req.body.newPassword);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.post('/graphql', bodyParser.json(), async (req, res) => {
  try {
    const apiRes = await fetch(`${process.env.API_URL}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query: req.body.query }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.body.token}`
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
