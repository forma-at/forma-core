import { MongoClient } from 'mongodb';

class DatabaseClient {

  // Database connection
  private readonly name: string;
  private readonly host: string;
  private readonly port: string;
  private readonly poolSize: string;
  private readonly uri: string;
  private readonly client: MongoClient;

  // DatabaseClient constructor
  constructor() {
    this.name = process.env.MONGODB_NAME;
    this.host = process.env.MONGODB_HOST;
    this.port = process.env.MONGODB_PORT;
    this.poolSize = process.env.MONGODB_POOLSIZE;
    this.uri = `mongodb://${this.host}:${this.port}?poolSize=${this.poolSize}&writeConcern=majority`;
    this.client = new MongoClient(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  // Open database connection, crash on failure
  async connect() {
    try {
      await this.client.connect();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  // Close database connection, crash on failure
  async disconnect() {
    if (this.client) {
      try {
        await this.client.close();
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    }
  }

  // Get the database object after the connection has been opened
  db() {
    if (!this.client) throw new Error('Database connection not found.');
    return this.client.db(this.name);
  }

}

export const databaseClient = new DatabaseClient();
