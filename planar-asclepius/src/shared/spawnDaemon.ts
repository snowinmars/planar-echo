import { fork } from 'child_process';
import { join } from 'path';

import logger from '@/shared/logger.js';

import type { ChildProcess } from 'child_process';

const DEFAULT_ARE = 'ar0202.are';

export const spawnDaemon = (ghostDir: string, modsDir: string, daemonDir: string): ChildProcess => {
  const distEntry = join(daemonDir, 'index.js');
  const child = fork(distEntry, [], {
    cwd: daemonDir,
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    execArgv: [],
  });

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  logger.info(`daemon fork ${distEntry} pid=${child.pid} ghost=${ghostDir} mods=${modsDir}`);
  child.send({ type: 'start', data: { ghostDir, modsDir, are: DEFAULT_ARE } });

  return child;
};
