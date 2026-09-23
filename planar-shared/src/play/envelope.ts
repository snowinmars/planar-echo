import type { Point } from '../geometry.js';
import type { EntityId } from './protocol.js';

/**
 * Shared actor record: the same shape in World.entities and on the snapshot/entity patches.
 * Like a real envelope: toWhom (to me) and toWhere (to my house). Content is irrelevent.
 *
 * Answer to "who, where and how do they look?".
 * Minimalistic type: only strictly required properties must be here
 */
export type Envelope = Readonly<{
  id: EntityId;
  cre: string;
  pos: Point;
  facing: number; // IE facing (S=0). Equals to planar-shared\src\direction.ts, but without parsing
  animationId: number; // CRE ANIMATE dword
  sequence: string; // PST:EE INI slot name: walk, stand, run, etc
}>;

export type EnvelopePatch = Partial<Omit<Envelope, 'id'>>;
