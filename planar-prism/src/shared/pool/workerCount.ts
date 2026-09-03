import { availableParallelism } from 'os';

import logger from '../logger.js';

export const workerCount = (): number => {
  const raw = process.env.PRISM_WORKERS;
  if (raw === undefined || raw === '') {
    const n = availableParallelism();
    logger.info(`Parallelism: '${n}'`);
    return n;
  }

  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) throw new Error(`PRISM_WORKERS must be a positive integer, got '${raw}'`);

  logger.info(`Parallelism: '${n}'`);
  return n;
};
