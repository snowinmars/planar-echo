import { isNothing } from '@planar/shared';

import type { ParsedBcsObject, BcsRegion } from '../bytecodeTypes.js';
import type { Maybe } from '@planar/shared';

const isEmptyRegion = (region: Maybe<BcsRegion>): boolean => {
  if (isNothing(region)) return true;
  return region.x === -1
    && region.y === -1
    && region.width === -1
    && region.height === -1;
};

const isEmptyName = (name: Maybe<string>): boolean =>
  isNothing(name) || name === '';

/**
 * Because of ie logic BCS action blocks carry object slots (often empty OB).
 * Presence (!isNothing) is not enough — only a non-empty object means ActionOverride.
 */
export const isEmptyObject = (object: ParsedBcsObject): boolean => {
  const emptyTargets = object.target.every(v => v === 0);
  const emptyIdentifiers = object.identifier.every(v => v === 0);
  return emptyTargets
    && emptyIdentifiers
    && isEmptyRegion(object.region)
    && isEmptyName(object.name);
};
