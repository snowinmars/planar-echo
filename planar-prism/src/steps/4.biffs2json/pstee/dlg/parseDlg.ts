import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import createReader from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseDlgV1 } from './v1/parseDlgV1.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Paths } from '@/steps/1.createPaths/index.js';
import type { RawDlg } from './types.js';

export const parseDlg = (
  paths: Paths,
  decompiledItems: DecompiledBiff[],
): AsyncIterableIterator<RawDlg> => iterate<DecompiledBiff, RawDlg>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'dlg') throw new Error(`Unsupported signature: ${signature}`);
    if (version !== 'v1.0') throw new Error(`Unsupported version: ${version}`);

    const dlg = parseDlgV1({
      reader,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'dlg_raw2json',
      params: {
        version: version,
        resourceName,
      },
    });

    return dlg;
  },
);
