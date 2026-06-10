import { dialogueToCreature } from '@planar/shared';
import type { GhostCreatureV10, GhostCreatureV11 } from '../../../types.js';

type GhostCreature = GhostCreatureV10 | GhostCreatureV11;

export const pickCre = (cres: Map<string, GhostCreature>, dlgResourceName: string): GhostCreature | 'narrator' => {
  const creResourceName = dialogueToCreature(dlgResourceName);
  if (creResourceName === 'narrator') return creResourceName;
  const creature = cres.get(creResourceName);
  if (!creature) throw new Error(`Cannot find creature '${creResourceName}'`);
  return creature;
};
