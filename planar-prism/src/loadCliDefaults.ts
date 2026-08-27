import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { packageDir } from '@planar/shared/node';

import type { PrismIndexStartMessage } from '@planar/shared';

export const loadCliDefaults = (): PrismIndexStartMessage['data'] => {
  const prismRoot = packageDir('@planar/prism', import.meta.url);
  const defaultsPath = join(prismRoot, 'cli.defaults.json');
  const examplePath = join(prismRoot, 'cli.defaults.example.json');
  const missing = !existsSync(defaultsPath);
  if (missing) {
    throw new Error(
      `CLI defaults file is missing: '${defaultsPath}'. Copy '${examplePath}' to '${defaultsPath}'.`,
    );
  }

  return JSON.parse(readFileSync(defaultsPath, 'utf8')) as PrismIndexStartMessage['data'];
};
