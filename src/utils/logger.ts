import { NODE_ENV } from '@/config';
import winston from 'winston';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const loggerFormat = winston.format.combine(
  winston.format.timestamp(),
  enumerateErrorFormat(),
  winston.format.splat(),
  winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
  ),
);

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    NODE_ENV === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    loggerFormat,
  ),
  stderrLevels: ['error'],
});

const fileTransport = new winston.transports.File({
  filename: 'debug.log',
  level: 'debug',
  format: loggerFormat,
});

const logger = winston.createLogger({
  level: NODE_ENV === 'development' ? 'debug' : 'info',
  format: loggerFormat,
  transports: [consoleTransport, fileTransport],
});

export default logger;
