/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const users = require('./mock/users.json');
const schools = require('./mock/schools.json');
const teachers = require('./mock/teachers.json');

// Load env variables
dotenv.config();

// Get environment variables
const name = process.env.MONGODB_NAME;
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const poolSize = process.env.MONGODB_POOLSIZE;

// Create MongoDB client
const uri = `mongodb://${host}:${port}?poolSize=${poolSize}&writeConcern=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to MongoDB and insert mock data
client.connect().then(async (connectedClient) => {
  const database = connectedClient.db(name);
  const now = Date.now();

  const usersWithMetadata = users.map((user) => ({ ...user, createdAt: now, updatedAt: now }));
  const schoolsWithMetadata = schools.map((school) => ({ ...school, createdAt: now, updatedAt: now }));
  const teachersWithMetadata = teachers.map((teacher) => ({ ...teacher, createdAt: now, updatedAt: now }));

  await database.collection('users').insertMany(usersWithMetadata);
  await database.collection('schools').insertMany(schoolsWithMetadata);
  await database.collection('teachers').insertMany(teachersWithMetadata);

  console.log('Mock data generated successfully.');
  process.exit(0);
});
