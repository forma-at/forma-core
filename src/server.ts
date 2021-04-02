import express from 'express';

const app = express();

const port = 5000;

app.get('/api', (req, res) => {
  res.status(200).send('API is running.');
});

app.listen(port, () => console.log(`Forma API service listening on port ${port}.`));
