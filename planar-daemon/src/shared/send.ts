import type { FromDaemon } from '@planar/kernel';

export const send = (fromDaemon: FromDaemon): void => {
  if (typeof process.send === 'function') {
    process.send(fromDaemon);
    return;
  }

  process.stdout.write(`${JSON.stringify(fromDaemon)}\n`);
};
