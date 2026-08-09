import { isNothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { BcsRegion, ParsedBcsObject } from '../bytecode.types.js';

const isEmptyRegion = (region: Maybe<BcsRegion>): boolean => {
  if (isNothing(region)) return true;
  return region.x === -1
    && region.y === -1
    && region.width === -1
    && region.height === -1;
};

/**
 * Because of ie logic BCS action blocks carry object slots (often empty OB).
 * Presence (!isNothing) is not enough - only a non-empty object means ActionOverride.
 */
export const isEmptyObject = (object: Maybe<ParsedBcsObject>): boolean => {
  if (isNothing(object)) return true;

  const emptyTargets = object.target.every(value => value === 0);
  const emptyIdentifiers = object.identifier.every(value => value === 0);
  const emptyName = isNothing(object.name) || object.name === '';

  return emptyTargets
    && emptyIdentifiers
    && isEmptyRegion(object.region)
    && emptyName;
};
