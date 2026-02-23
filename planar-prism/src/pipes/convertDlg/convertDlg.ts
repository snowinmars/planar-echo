import { join } from 'path';
import { readFile } from 'fs/promises';

import attachWeights from './patches/attachWeights.js';
import readDlgBuffer from './patches/readDlgBuffer.js';
import patchTranslation from './patches/patchTranslation.js';
import nestDialogue from './patches/nestDialogue.js';

import type { NpcDialogue } from './types.js';
import type { DecompiledItem, Pathes } from 'src/shared/types.js';
import type { TlkEntry } from '../convertTlk/types.js';

const readNpcDialogueFile = async (filePath: string, resourceName: string, tlk: TlkEntry): Promise<NpcDialogue> => {
  const buffer = await readFile(filePath);
  const raw = await readDlgBuffer(buffer, resourceName);
  const weighted = attachWeights(raw);
  const translated = patchTranslation(weighted, tlk);
  const nested = nestDialogue(translated);
  return nested;
};

const convertDlg = async (pathes: Pathes, items: DecompiledItem[], tlk: TlkEntry, percentCallback: ((percent: number) => void) | null = null): Promise<NpcDialogue[]> => {
  const npcDialogues: NpcDialogue[] = [];
  let i = 0;

  for (const item of items) {
    const npcDialogue = await readNpcDialogueFile(join(pathes.output.decimpiledBiff, item.name), item.name, tlk);
    const percent = Math.round(i * 100 / items.length);
    percentCallback?.(percent);
    npcDialogues.push(npcDialogue);
    i++;
  }

  return npcDialogues;
};

export default convertDlg;
