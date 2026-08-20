import {
  createLogger,
  format,
  transports,
} from 'winston';

const loggerFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.simple(),
);

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.Console({
      format: loggerFormat,
    }),
    new transports.File({
      format: loggerFormat,
      filename: `${new Date().toLocaleDateString('ru-RU')}-planar.log`,
      dirname: 'logs',
      maxFiles: 5,
      level: 'info',
    }),
  ],
});

export default logger;
