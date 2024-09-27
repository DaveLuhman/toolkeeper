import winston from 'winston';
import 'winston-mongodb'; // Optional for MongoDB transport
import { Log } from '../models/index.models.js';

function replaceDatabaseName(uri, dbName) {
    // Use a regular expression to find the database name in the URI
    return uri.replace(/\/([a-zA-Z0-9_-]+)(\?|$)/, `/${dbName}$2`);
  }

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'combined.log' }), // General log file
    new winston.transports.File({ filename: 'error.log', level: 'error' }), // Error log
    // Optional: MongoDB transport for tenant-specific logs
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      collection: 'logs',
      level: 'error',
      options: { useUnifiedTopology: true },
      capped: true,
      metaKey: 'metadata', // For attaching tenantId
    }),
  ],
});

export const getLogsByTenant = async (tenantId) => {
  return await Log.find({ tenantId }).sort({ timestamp: -1 }).lean();  // Fetch logs, most recent first
};

export default logger