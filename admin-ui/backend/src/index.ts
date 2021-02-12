import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('test site');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => console.log(`Server runnning at http://localhost:${process.env.PORT}`));
}

export default app;