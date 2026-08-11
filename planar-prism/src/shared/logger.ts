import {
  createLogger,
  format,
  transports,
} from 'winston';

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
    new transports.File({
      format: format.simple(),
      filename: `${new Date().toLocaleDateString('ru-RU')}-planar.log`,
      dirname: 'logs',
      maxFiles: 5,
      level: 'info',
    }),
  ],
});

export default logger;
