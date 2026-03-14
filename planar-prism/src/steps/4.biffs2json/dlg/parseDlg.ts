import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '../../../shared/maybe.js';
import iterate from '../../../steps/iterate.js';
import parseDlgV1FromBuffer from './v1/parseDlgV1FromBuffer.js';
import attachWeights from './v1/patches/1.attachWeights.js';
import patchTranslation from './v1/patches/2.patchTranslation.js';
import nestDialogue from './v1/patches/3.nestDialogue.js';
import createReader from '../../../pipes/readers.js';

import type { DecompiledBiff } from '../../../steps/3.decompileBiffs/index.js';
import type { Pathes } from '../../../steps/1.createPathes/index.js';
import type { LogPercent } from '../../../shared/types.js';
import type { Dlg } from './types.js';
import type { Maybe } from '../../../shared/maybe.js';
import type { Tlk } from '../tlk/index.js';
import type { Signature, Versions } from './types.js';
import createMeta from '../meta.js';
import type { Ids } from '../ids/index.js';

const parseDlg = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  tlk: Tlk,
  ids: Map<string, Ids>,
  percentCallback: Maybe<LogPercent> = nothing(),
): AsyncIterableIterator<Dlg> => iterate<DecompiledBiff, Dlg>(
  decompiledItems,
  async (decompiledItem) => {
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

    const raw = parseDlgV1FromBuffer(reader, meta);
    const weighted = attachWeights(raw);
    const translated = patchTranslation(weighted, tlk);
    const nested = nestDialogue(translated);

    return nested;
  },
  percentCallback,
);

export default parseDlg;
