import { isNothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { RawBcsRegion } from '../bytecode/parseRegion.types.js';
import type { RawBcsObject } from '../bytecode/parseOb.types.js';

const isEmptyRegion = (region: Maybe<RawBcsRegion>): boolean => {
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
export const isEmptyObject = (object: Maybe<RawBcsObject>): boolean => {
  if (isNothing(object)) return true;

  const emptyTargets = object.target.every(value => value === 0);
  const emptyIdentifiers = object.identifier.every(value => value === 0);
  const emptyName = isNothing(object.name) || object.name === '';

  return emptyTargets
    && emptyIdentifiers
    && isEmptyRegion(object.region)
    && emptyName;
};
