import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('pong');
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
    res.send(json);
  } catch (err) {
    res.status(500).send(err);
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
}

export default app;
