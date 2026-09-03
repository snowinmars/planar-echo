import { writeFile } from 'fs/promises';
import { join } from 'path';

export const writeAssetFile = (
  assetsRoot: string,
  kind: string,
  fileName: string,
  data: Buffer,
): Promise<void> => writeFile(join(assetsRoot, kind, fileName), data);
