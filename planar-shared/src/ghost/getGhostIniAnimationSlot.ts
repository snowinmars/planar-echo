import { isNothing, nothing, optional } from '../maybe.js';
import { GHOST_INI_ANIMATION_SLOT_KEYS } from './iniKind.js';

import type { Maybe } from '../maybe.js';
import type { GhostIniAnimation, GhostIniAnimationSlot } from './ini.types.js';
import type { GhostIniAnimationSlotKey } from './iniKind.js';

const isKnownSlotKey = (sequence: string): sequence is GhostIniAnimationSlotKey => GHOST_INI_ANIMATION_SLOT_KEYS.includes(sequence as typeof GHOST_INI_ANIMATION_SLOT_KEYS[number]);

const ghostIniAnimationSlot = (
  animation: GhostIniAnimation,
  sequence: string,
): Maybe<GhostIniAnimationSlot> => {
  const knownSlotKey = isKnownSlotKey(sequence);
  if (!knownSlotKey) return nothing();

  return animation.monsterPlanescape[sequence];
};

export const getGhostIniAnimationSlot = (
  animation: GhostIniAnimation,
  sequence: string,
): GhostIniAnimationSlot => {
  const expected = ghostIniAnimationSlot(animation, sequence);
  const dummy = ghostIniAnimationSlot(animation, 'stand');

  if (isNothing(dummy)) throw new Error(`Animation '${animation.resourceName}' must have 'stand' option in 'monsterPlanescape' section`);

  return optional(expected, dummy);
};
