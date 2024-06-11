import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;
import DailyRotateFile from 'winston-daily-rotate-file';

const customFormat = printf(({ level, message, timestamp }) => {
  if (typeof message === 'object') {
    message = JSON.stringify(message, null, 2);
  }
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    customFormat
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/info-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/http-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'http',
      maxFiles: '14d',
    }),
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        customFormat
      ),
      level: 'info'
    }),
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp(),
        customFormat
      ),
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});

export default logger;