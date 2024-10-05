// setupFile.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables based on the NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

// Set up MongoDB connection
(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is missing.');
    }

    console.log(`Connecting to MongoDB at ${process.env.MONGO_URI}...`);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connection established.');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
})();

// Close the MongoDB connection after all tests are done
afterAll(async () => {
  await mongoose.disconnect();
  console.log('MongoDB connection closed.');
});
