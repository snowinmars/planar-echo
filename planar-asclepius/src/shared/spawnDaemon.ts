import { fork } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import logger from '@/shared/logger.js';

import type { ChildProcess } from 'child_process';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..'); // TODO [snow]: do something with the pathes already
const DEFAULT_ARE = 'ar0202.are';

export const spawnDaemon = (ghostDir: string): ChildProcess => {
  const distEntry = join(repoRoot, 'planar-daemon', 'dist', 'index.js');

  const child = fork(distEntry, [], {
    cwd: join(repoRoot, 'planar-daemon'),
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    execArgv: [],
  });

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  logger.info(`daemon fork ${distEntry} ghost=${ghostDir}`);
  child.send({ type: 'start', data: { ghostDir, are: DEFAULT_ARE } });

  return child;
};
