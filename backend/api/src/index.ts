import * as express from 'express';

const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(8089, () => console.log('Server running at http://localhost:8089'));
}

export default app;
