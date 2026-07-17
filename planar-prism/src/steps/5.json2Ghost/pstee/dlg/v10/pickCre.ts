import { dialogueToCreatures, dialogueToItems, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type {
  GhostCreatureV10,
  GhostCreatureV11,
  GhostItemV10,
} from '../../../types.js';

type GhostCreature = GhostCreatureV10 | GhostCreatureV11;

const pickItem = (items: Map<string, GhostItemV10>, dlgResourceName: string): Maybe<GhostItemV10> | 'narrator' => {
  try {
    const creResourceNames = dialogueToItems(dlgResourceName);
    if (creResourceNames.length === 1 && creResourceNames[0] === 'narrator') return creResourceNames[0];
    const creature = items.get(creResourceNames[0]!)!;

    return creature;
  }
  catch {
    return nothing();
  }
};

const pickCreature = (cres: Map<string, GhostCreature>, dlgResourceName: string): Maybe<GhostCreature> | 'narrator' => {
  try {
    const creResourceNames = dialogueToCreatures(dlgResourceName);
    if (creResourceNames.length === 1 && creResourceNames[0] === 'narrator') return creResourceNames[0];
    const creature = cres.get(creResourceNames[0]!)!;

    return creature;
  }
  catch {
    return nothing();
  }
};

export const pickCreatureOrItemToTalk = (
  cres: Map<string, GhostCreature>,
  items: Map<string, GhostItemV10>,
  dlgResourceName: string): GhostCreature | GhostItemV10 | 'narrator' => {
  const creature = pickCreature(cres, dlgResourceName);
  const item = pickItem(items, dlgResourceName);

  if (!creature && !item) throw new Error(`Cannot find creature or item for '${dlgResourceName}'`);
  if (creature) return creature;
  return item!;
};
