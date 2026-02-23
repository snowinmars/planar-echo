import { spawn } from 'child_process';

import logger from '../shared/logger.js';
import { just, type Maybe } from './types.js';

const splitCommand = (command: string): [string, string[]] => {
  let args: string[] = [];
  const splitted = command.split(' ');
  if (splitted.length === 0) throw new Error('Empty command');
  const cmd = command.split(' ')[0]!;
  if (splitted.length > 1) {
    args = command.split(' ').slice(1);
  }

  return [cmd, args];
};

const execConsole = async <T>(
  command: string,
  map: (line: string) => Maybe<T>,
  ignoreStdout = false,
): Promise<T[]> => {
  logger.debug(`Executing '${command}'`);

  return new Promise((resolve, reject) => {
    const [cmd, args] = splitCommand(command);

    const proc = spawn(cmd, args, {
      shell: true,
      windowsHide: true,
    });

    let stdoutBuffer = '';
    let stderrBuffer = '';
    const results: T[] = [];

    if (ignoreStdout) {
      proc.stdout.on('data', () => {});
    }
    else {
      proc.stdout.on('data', (chunk: Buffer) => {
        const data = chunk.toString();
        stdoutBuffer += data;

        let newlineIndex;
        while ((newlineIndex = stdoutBuffer.indexOf('\n')) !== -1) {
          const line = stdoutBuffer.slice(0, newlineIndex).trim();
          stdoutBuffer = stdoutBuffer.slice(newlineIndex + 1);

          if (line) {
            const mapped = map(line);
            if (mapped) results.push(just(mapped));
          }
        }
      });
    }

    proc.stderr.on('data', (chunk: Buffer) => {
      stderrBuffer += chunk.toString();
    });

    proc.on('close', (code) => {
      if (code === 0) {
        if (!ignoreStdout && stdoutBuffer.trim()) {
          const mapped = map(stdoutBuffer.trim());
          if (mapped) results.push(just(mapped));
        }
        resolve(results);
      }
      else {
        reject(new Error(stderrBuffer || `Process exited with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
};

export default execConsole;
