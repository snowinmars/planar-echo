import { fork } from 'child_process';
import { join } from 'path';
import { Observable, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { prismDir } from '../shared/folders.js';

import type {
  PrismIndexStartMessage,
  PrismIndexProgressMessage,
  PrismIndexCompleteMessage,
  PrismIndexErrorMessage,
} from '@planar/shared';

type Message = PrismIndexStartMessage | PrismIndexProgressMessage | PrismIndexCompleteMessage | PrismIndexErrorMessage;
type Response = PrismIndexStartMessage['data'] | PrismIndexProgressMessage['data'] | PrismIndexErrorMessage['data'];

const runPrismScript = <T>(commandName: string, data: T): Observable<Response> => {
  const destroy$ = new Subject<void>();

  const commandCwd = join(prismDir, 'dist');
  const scriptPath = join(commandCwd, commandName);

  const child = fork(scriptPath, {
    cwd: commandCwd,
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  });

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  child.send({ type: 'start', data });

  return new Observable<Response>((subscriber) => {
    child.on('message', (msg: Message) => {
      if (msg.type === 'progress') return subscriber.next(msg.data);
      if (msg.type === 'complete') return subscriber.complete();
      if (msg.type === 'error') return subscriber.error(msg.data);
    });

    child.on('error', err => subscriber.error(err));

    child.on('exit', (code) => {
      if (code !== 0) subscriber.error(new Error(`Exit code ${code}`));
      else subscriber.complete();
    });

    return () => {
      destroy$.next();
      destroy$.complete();
      if (!child.killed) child.kill();
    };
  }).pipe(
    takeUntil(destroy$),
    finalize(() => {
      if (!child.killed) child.kill();
    }),
  );
};

export default runPrismScript;
