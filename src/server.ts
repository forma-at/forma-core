import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cors from 'cors';
import routes from './routes';
import { databaseClient } from './utils';
import { errorHandler } from './middlewares';

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
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('API is running.');
});

// Attach route listeners
app.use('/api', routes);

// Set up error handler middleware
app.use(errorHandler);

// Connect to database
databaseClient.connect().then(() => {

  // Start listening to requests on port
  app.listen(port, () => console.log(`Forma API service listening on port ${port}.`));

});
