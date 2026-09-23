import type { FromDaemon } from '@planar/shared';

export const send = (fromDaemon: FromDaemon): void => {
  if (typeof process.send === 'function') {
    process.send(fromDaemon);
    return;
  }

  process.stdout.write(`${JSON.stringify(fromDaemon)}\n`);
};
