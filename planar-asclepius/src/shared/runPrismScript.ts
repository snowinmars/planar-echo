import { fork } from 'child_process';
import { dirname, join } from 'path';
import { Observable, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import type { ChildProcess } from 'child_process';
import type {
  PrismIndexStartMessage,
  PrismIndexProgressMessage,
  PrismIndexCompleteMessage,
  PrismIndexErrorMessage,
} from '@planar/shared';

type PrismIndexMessage = PrismIndexStartMessage | PrismIndexProgressMessage | PrismIndexCompleteMessage | PrismIndexErrorMessage;
type PrismIndexResponse = PrismIndexProgressMessage['data'] | PrismIndexErrorMessage['data'];

const runPrismScript = <T>(prismDir: string, commandName: string, data: T): Observable<PrismIndexResponse> => {
  const destroy$ = new Subject<void>();
  let child: ChildProcess;
  return new Observable<PrismIndexResponse>((subscriber) => {
    const scriptDir = join(prismDir, commandName);
    const commandCwd = dirname(scriptDir);

    child = fork(scriptDir, {
      cwd: commandCwd,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    });

    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stderr);

    child.send({ type: 'start', data });

    child.on('message', (msg: PrismIndexMessage) => {
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
      if (child) {
        if (!child.killed) child.kill();
      }
    }),
  );
};

export default runPrismScript;
