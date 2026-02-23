import {
  createLogger,
  format,
  transports,
} from 'winston';

const logger = createLogger({
  level: 'debug',
  format: format.json(),
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
  ],
});

export default logger;
