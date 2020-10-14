import bodyParser from 'body-parser';
import express from 'express';
import { join } from 'path';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

if (process.env.NODE_ENV === 'dev') {
  app.use(cors({ origin: 'http://localhost:3000' }));
}

app.use(express.static(join(__dirname, process.env.STATIC_ASSETS_PATH)));

app.get('/ping', (req, res) => {
  res.send('pong.');
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, process.env.STATIC_ASSETS_PATH, 'index.html'));
});

app.use('/graphql', bodyParser.json(), async (req, res) => {
  try {
    const apiRes = await fetch(`${process.env.API_URL}/graphql`, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.PUBLIC_TOKEN
      }
    });
    const json = await apiRes.json();
    res.send(json);
  } catch (err) {
    console.error(err)
    res.status(500).send(err);
  }
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => console.log(`Server running at http://localhost:${process.env.PORT}`));
}

export default app;
