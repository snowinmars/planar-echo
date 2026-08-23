import { join } from 'path';
import { writeFile } from 'fs/promises';

export const writeAssetFile = (
  assetsRoot: string,
  kind: string,
  fileName: string,
  data: Buffer,
): Promise<void> => writeFile(join(assetsRoot, kind, fileName), data);
