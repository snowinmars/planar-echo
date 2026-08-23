import { parentPort, workerData } from 'worker_threads';

import type { PoolWorkerData, MainToWorker, WorkerToMain, ParseOne } from './pool.types.js';

if (!parentPort) throw new Error('pool.worker must run as a worker thread');

const data = workerData as PoolWorkerData;
const port = parentPort;

const loadParseOne = async (kind: PoolWorkerData['kind']): Promise<ParseOne> => {
  switch (kind) {
    case 'pvrz': return (await import('@/steps/4b.raw2assets/writePvrz.js')).writeOnePvrz;
    case 'bam': return (await import('@/steps/4b.raw2assets/writeBam.js')).writeOneBam;
    case 'mos': return (await import('@/steps/4b.raw2assets/writeMos.js')).writeOneMos;
    case 'tis': return (await import('@/steps/4b.raw2assets/writeTis.js')).writeOneTis;
    case 'bmp': return (await import('@/steps/4b.raw2assets/writeBmp.js')).writeOneBmp;
    case 'wav': return (await import('@/steps/4b.raw2assets/writeWav.js')).writeOneWav;
    case 'acm': return (await import('@/steps/4b.raw2assets/writeAcm.js')).writeOneAcm;
    case 'are': return (await import('@/steps/4b.raw2assets/writeAre.js')).writeOneAre;
  }
};

const parseOne = await loadParseOne(data.kind);

const handle = async (msg: MainToWorker): Promise<void> => {
  if (msg.type === 'drain') {
    port.close();
    return;
  }

  try {
    const result = await parseOne({
      resourceName: msg.resourceName,
      decompiledRoot: data.decompiledRoot,
      assetsRoot: data.assetsRoot,
      context: data.context,
      payload: msg.payload,
    });
    const out: WorkerToMain = {
      type: 'result',
      resourceName: msg.resourceName,
      value: result.value,
    };
    port.postMessage(out, result.transfer ?? []);
    const idle: WorkerToMain = { type: 'idle' };
    port.postMessage(idle);
  }
  catch (e: unknown) {
    const err = e instanceof Error ? e : new Error(String(e));
    const out: WorkerToMain = {
      type: 'error',
      resourceName: msg.resourceName,
      message: err.message,
    };
    port.postMessage(out);
  }
};

let chain = Promise.resolve();
port.on('message', (msg: MainToWorker) => {
  chain = chain.then(() => handle(msg)).catch((e: unknown) => {
    const err = e instanceof Error ? e : new Error(String(e));
    const out: WorkerToMain = {
      type: 'error',
      resourceName: null,
      message: err.message,
    };
    port.postMessage(out);
  });
});

const idle: WorkerToMain = { type: 'idle' };
port.postMessage(idle);
