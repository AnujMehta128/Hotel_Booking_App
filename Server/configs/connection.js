const mongoose = require('mongoose');
require('dotenv').config();

// Critical global settings for serverless
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', false);

const MONGODB_URL = process.env.MONGODB_URL;

// Cache the connection to prevent multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function handleMongodbConnectionRequest() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URL) {
    throw new Error('Please define MONGODB_URL environment variable');
  }

  try {
    // Set up event listeners before connecting
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // If no cached promise exists, create new connection
    if (!cached.promise) {
      const opts = {
        bufferCommands: false, // Disable mongoose buffering - CRITICAL
        serverSelectionTimeoutMS: 10000, // Faster failure for serverless
        socketTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxPoolSize: 1, // Minimal pool for serverless
        minPoolSize: 1,
        retryWrites: true,
        retryReads: true,
      };

      cached.promise = mongoose
        .connect(`${MONGODB_URL}/hotel-booking-application`, opts)
        .then((mongoose) => {
          console.log('MongoDB connection established');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          cached.promise = null; // Reset promise on error
          throw error;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;

  } catch (error) {
    cached.promise = null; // Reset on error
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

module.exports = {
  handleMongodbConnectionRequest
};