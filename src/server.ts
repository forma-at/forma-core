import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';

// Create Express app
const app = express();

// Set port, default is 5000
const port = process.env.PORT || 5000;

// Set up BodyParser and CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

// Test API
app.get('/api', (req, res) => {
  res.status(200).send('API is running.');
});

// Attach route listeners
app.use('/api', routes);

// Start listening on port
app.listen(port, () => console.log(`Forma API service listening on port ${port}.`));
