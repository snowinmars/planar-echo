import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '@planar/shared';
import iterate from '@/steps/iterate.js';
import createReader from '@/pipes/readers.js';
import { reportProgress } from '@/shared/report.js';
import parseDlgV1FromBuffer from './v1/parseDlgV1FromBuffer.js';
import createMeta from '../meta.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { LogPercent } from '@/shared/types.js';
import type { Maybe } from '@planar/shared';
import type { Tlk } from '../tlk/index.js';
import type { RawDlg, Signature, Versions } from './types.js';
import type { Ids } from '../ids/index.js';

const parseDlg = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  tlk: Tlk,
  ids: Map<string, Ids>,
  percentCallback: Maybe<LogPercent> = nothing(),
): AsyncIterableIterator<RawDlg> => iterate<DecompiledBiff, RawDlg>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(pathes.output.decimpiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'dlg') throw new Error(`Unsupported signature: ${signature}`);
    if (version !== 'v1.0') throw new Error(`Unsupported version: ${version}`);

    const meta = createMeta<Signature, Versions>({
      signature,
      version,
      resourceName,
      gameName: pathes.gameName,
      ids,
    });

    const dlg = parseDlgV1FromBuffer(reader, meta);

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'parseDlg',
      params: {
        version: meta.version,
        resourceName,
      },
    });

    return dlg;
  },
  percentCallback,
);

export default parseDlg;
