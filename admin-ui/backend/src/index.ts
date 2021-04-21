import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import dbWrapper, { createMongoConnection } from './db-wrapper';

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(cors({ origin: 'http://localhost:3000' }));
}

app.get('/', (req, res) => {
  res.send('test site');
});

app.post('/login', bodyParser.json(), async (req, res) => {
  const user = await dbWrapper.getUser(req.body.email);
  if (!user) {
    return res.status(500).send('User not found.');
  } else if (user.password !== req.body.password) {
    return res.status(500).send('Incorrect password.');
  }
  res.send(JSON.stringify({
    name: user.name,
    email: user.email
  }));
});

if (process.env.NODE_ENV !== 'test') {
  createMongoConnection();
  app.listen(process.env.PORT, () => console.log(`Server runnning at http://localhost:${process.env.PORT}`));
}

export default app;