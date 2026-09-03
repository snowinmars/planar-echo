import { spawn } from 'child_process';

import { just } from './maybe.js';

import type { Maybe } from './maybe.js';

export type ExecConsoleProps = Readonly<{
  file: string;
  args: readonly string[];
  cwd?: string;
}>;

export const execConsole = async <T>(
  props: ExecConsoleProps,
  map: (line: string, i: number) => Maybe<T>,
  ignoreStdout = false,
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const proc = spawn(props.file, [...props.args], {
      shell: false,
      windowsHide: true,
      cwd: props.cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Close stdin so WeiDU autopause ("Press ENTER") gets EOF instead of hanging.
    // Do not use stdio 'ignore' for stdin - some WeiDU builds then exit before doing work.
    if (proc.stdin) {
      proc.stdin.on('error', (e) => {
        console.warn(e);
      });
      proc.stdin.end();
    }

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
        let i = 1;
        while ((newlineIndex = stdoutBuffer.indexOf('\n')) !== -1) {
          const line = stdoutBuffer.slice(0, newlineIndex).trim();
          stdoutBuffer = stdoutBuffer.slice(newlineIndex + 1);

          if (line) {
            const mapped = map(line, i);
            if (mapped) {
              results.push(just(mapped));
              i++;
            }
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
          const mapped = map(stdoutBuffer.trim(), 0);
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
