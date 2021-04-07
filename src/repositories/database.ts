import { MongoClient, Db } from 'mongodb';

// Get database connection config
const name = process.env.MONGODB_NAME;
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const poolSize = process.env.MONGODB_POOLSIZE;

// Create database client
const uri = `mongodb://${host}:${port}?poolSize=${poolSize}&writeConcern=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Open database connection, crash on failure
export const openDbConnection = async () => {
  try {
    await client.connect()
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Close database connection, crash on failure
export const closeDbConnection = async () => {
  if (client) {
    try {
      await client.close();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
};

// Get the database object after the connection has been opened
export const db = (): Db => {
  if (!client) throw new Error('Database connection not found.');
  return client.db(name);
};
