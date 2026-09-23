import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname } from 'path';

import { fileExists } from '@planar/shared/node';

import { createPaths } from './createPaths.js';
import { pathsSchema } from './createPaths.types.js';
import logger from './logger.js';

import type { Paths } from './createPaths.types.js';

// TODO [snow]: drop class, create function factory
export class PathsStore {
  current: Paths;

  constructor(private readonly filePath: string) {
    this.current = createPaths();
    this.load().catch(logger.error); // TODO [snow]: meh...
  }

  async load(): Promise<Paths> {
    const found = await fileExists(this.filePath);

    if (!found) {
      logger.info(`Create paths from '${this.filePath}'`);
      return this.save(createPaths());
    }

    const raw = await readFile(this.filePath, { encoding: 'utf8' });

    const parsed: unknown = JSON.parse(raw);
    const paths = pathsSchema.parse(parsed);
    this.current = paths;

    return this.current;
  }

  async save(paths: Paths): Promise<Paths> {
    const parsed = pathsSchema.parse(paths);

    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, `${JSON.stringify(parsed, null, 2)}\n`, { encoding: 'utf8' });

    this.current = parsed;

    return this.current;
  }
}
