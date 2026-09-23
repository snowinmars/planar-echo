import { writeFile } from 'fs/promises';
import { join } from 'path';

import type { ActiveJsonMods } from '@planar/shared';

export const writeActiveJson = async (path: string, activeJson: ActiveJsonMods): Promise<void> => writeFile(join(path, 'active.json'), `${JSON.stringify(activeJson, null, 2)}\n`, 'utf8');
