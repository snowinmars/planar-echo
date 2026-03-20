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
  ],
});

export default logger;
