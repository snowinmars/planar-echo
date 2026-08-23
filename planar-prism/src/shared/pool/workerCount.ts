import { availableParallelism } from 'os';

export const workerCount = (): number => {
  const raw = process.env.PRISM_WORKERS;
  if (raw === undefined || raw === '') return availableParallelism();

  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) throw new Error(`PRISM_WORKERS must be a positive integer, got '${raw}'`);

  return n;
};
