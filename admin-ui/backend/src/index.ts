import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { createMongoConnection } from './db-wrapper';
import { getUserObject } from './user';

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

if (process.env.NODE_ENV !== 'test') {
  createMongoConnection();
  app.listen(process.env.PORT, () => console.log(`Server runnning at http://localhost:${process.env.PORT}`));
}

export default app;