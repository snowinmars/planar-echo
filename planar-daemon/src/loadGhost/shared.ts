import { readFile } from 'fs/promises';
import { join } from 'path';

import { evalGhostFactory } from '@planar/shared';

export const ghostJs = (ghostDir: string, kind: string, resourceName: string): string => (
  join(ghostDir, 'ghost', kind, 'dist', `${resourceName}.js`)
);

export const loadGhostJs = async <T>(filePath: string): Promise<T> => {
  const src = await readFile(filePath, 'utf8');
  return evalGhostFactory<T>(src)();
};
