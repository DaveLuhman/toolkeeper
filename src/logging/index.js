import winston from 'winston';
import 'winston-mongodb'; // Optional for MongoDB transport
import { Log } from '../models/index.models.js';
import process from "node:process";

const logger = winston.createLogger({
    level: 'verbose', // Set the default logging level to verbose
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: '_logs/combined.log' }), // General log file
        new winston.transports.File({ filename: '_logs/error.log', level: 'error' }), // Error log
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI,
            collection: 'logs',
            level: 'info', // Log info level and higher to MongoDB
            options: { useUnifiedTopology: true },
            capped: true,
            metaKey: 'metadata', // For attaching tenantId
        }),
    ],
});

export const getLogsByTenant = async (tenantId) => {
    return await Log.find({ tenantId }).sort({ timestamp: -1 }).lean();  // Fetch logs, most recent first
};

export default logger;