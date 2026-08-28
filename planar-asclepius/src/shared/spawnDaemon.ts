import { fork } from 'child_process';
import logger from '@/shared/logger.js';
import { defaultDaemonCwd, defaultDaemonEntry } from '@/shared/layout.js';

import type { ChildProcess } from 'child_process';

const DEFAULT_ARE = 'ar0202.are';

export const spawnDaemon = (ghostDir: string): ChildProcess => {
  const distEntry = defaultDaemonEntry();
  const child = fork(distEntry, [], {
    cwd: defaultDaemonCwd(),
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    execArgv: [],
  });

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  logger.info(`daemon fork ${distEntry} pid=${child.pid} ghost=${ghostDir}`);
  child.send({ type: 'start', data: { ghostDir, are: DEFAULT_ARE } });

  return child;
};
