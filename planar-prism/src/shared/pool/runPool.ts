import { Worker } from 'worker_threads';
import { reportProgress } from '@/shared/report.js';
import { workerCount } from './workerCount.js';

import type { PoolKind, PoolResourceStep, PoolWorkerData, PoolJob, MainToWorker, WorkerToMain } from './pool.types.js';

type RunPoolProps = Readonly<{
  kind: PoolKind;
  jobs: PoolJob[];
  decompiledRoot: string;
  assetsRoot: string;
  step: PoolResourceStep;
  context?: unknown;
}>;

type Pending = Readonly<{
  resourceName: string;
  value: unknown;
  workerId: number;
}>;

export async function* runPool<T>(props: RunPoolProps): AsyncGenerator<T> {
  const { kind, jobs, decompiledRoot, assetsRoot, step } = props;
  if (jobs.length === 0) return;

  const n = Math.min(workerCount(), jobs.length);
  const queue = jobs.slice();
  const workerUrl = new URL('./pool.worker.js', import.meta.url);

  const workerData: PoolWorkerData = props.context === undefined
    ? { kind, decompiledRoot, assetsRoot }
    : { kind, decompiledRoot, assetsRoot, context: props.context };

  const workers: Worker[] = [];
  const idle = new Set<number>();
  const inFlight = new Set<number>();
  const pending: Pending[] = [];
  let failed: Error | null = null;
  let notify: (() => void) | null = null;

  const wake = (): void => {
    const fn = notify;
    notify = null;
    fn?.();
  };

  const wait = (): Promise<void> => new Promise((resolve) => {
    notify = resolve;
  });

  const assign = (workerId: number): void => {
    const worker = workers[workerId];
    if (!worker) throw new Error(`Missing worker '${workerId}'`);

    idle.delete(workerId);
    const job = queue.shift();
    if (!job) {
      inFlight.delete(workerId);
      const drain: MainToWorker = { type: 'drain' };
      worker.postMessage(drain);
      return;
    }

    inFlight.add(workerId);
    const msg: MainToWorker = { type: 'job', resourceName: job.resourceName, payload: job.payload };
    worker.postMessage(msg);
  };

  const assignIdle = (): void => {
    for (const workerId of [...idle]) assign(workerId);
  };

  for (let i = 0; i < n; i = i + 1) {
    const workerId = i;
    const worker = new Worker(workerUrl, {
      workerData,
      type: 'module',
    } as import('worker_threads').WorkerOptions);
    workers.push(worker);

    let chain = Promise.resolve();
    worker.on('message', (msg: WorkerToMain) => {
      chain = chain.then(() => {
        if (failed) return;

        if (msg.type === 'error') {
          failed = new Error(msg.resourceName
            ? `${kind} '${msg.resourceName}': ${msg.message}`
            : `${kind}: ${msg.message}`);
          wake();
          return;
        }

        if (msg.type === 'result') {
          inFlight.delete(workerId);
          pending.push({
            resourceName: msg.resourceName,
            value: msg.value,
            workerId,
          });
          wake();
          return;
        }

        if (msg.type === 'idle') {
          idle.add(workerId);
          wake();
        }
      }).catch((e: unknown) => {
        failed = e instanceof Error ? e : new Error(String(e));
        wake();
      });
    });

    worker.on('error', (err: Error) => {
      failed = err;
      wake();
    });

    worker.on('exit', (code: number) => {
      if (code !== 0 && !failed && inFlight.has(workerId)) {
        failed = new Error(`${kind} worker '${workerId}' exited with code '${code}'`);
        wake();
      }
    });
  }

  let completed = 0;

  try {
    while (completed < jobs.length) {
      if (failed) throw failed;

      if (pending.length > 0) {
        const item = pending.shift();
        if (!item) throw new Error('Pending result disappeared');

        completed = completed + 1;
        reportProgress({
          value: Math.round(completed * 100 / jobs.length),
          step,
          params: {
            resourceName: item.resourceName,
            rssBytes: process.memoryUsage().rss,
          },
        });
        yield item.value as T;
        assignIdle();
        continue;
      }

      assignIdle();
      await wait();
    }
  } finally {
    await Promise.all(workers.map(w => w.terminate()));
  }

  if (failed) throw failed;
}
