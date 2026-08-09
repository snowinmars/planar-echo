import { isNothing, just, nothing } from '@planar/shared';
import { PST_OBJECT_TARGET_IDS } from '../../engineRules.js';
import { lookupIdsSymbol } from './lookupIdsSymbol.js';

import type { Maybe } from '@planar/shared';
import type { Ids } from '../../../ids/types.js';
import type { BcsArg } from '../../parseBcs.types.js';
import type { ParsedBcsObject } from '../bytecode.types.js';

const translateTarget = (
  object: ParsedBcsObject,
  ids: Map<string, Ids>,
): Maybe<string> => {
  const lastUsedIndex = object.target.findLastIndex(value => value !== 0);
  if (lastUsedIndex < 0) return nothing();

  const parts: string[] = [];
  for (let i = 0; i < lastUsedIndex + 1; i++) {
    const idsName = PST_OBJECT_TARGET_IDS[i] ?? `target${i}`;
    const value = just(object.target[i]);

    if (value === 0) {
      parts.push('0');
      continue;
    }

    const symbol = lookupIdsSymbol(ids, idsName, value);
    parts.push(symbol ?? String(value));
  }

  return `[${parts.join('.')}]`;
};

type BcsStringFunctionArg = Extract<BcsArg, { kind: 'string' | 'function' }>;
export const translateObject = (
  object: ParsedBcsObject,
  ids: Map<string, Ids>,
): BcsStringFunctionArg => {
  let target = translateTarget(object, ids);

  if (isNothing(target) && !isNothing(object.name) && object.name !== '') {
    target = object.name;
  }

  const identifiers: string[] = [];
  const lastUsed = object.identifier.findLastIndex(value => value !== 0);

  for (let i = lastUsed; i >= 0; i--) {
    const value = object.identifier[i]!;
    if (value === 0) break;

    const symbol = lookupIdsSymbol(ids, 'object', value);
    if (isNothing(symbol)) throw new Error(`Unknown OBJECT.IDS id ${value}`);
    identifiers.push(symbol);
  }

  if (isNothing(target) && identifiers.length === 0) target = '[anyone]';

  const hasRegion = !isNothing(object.region);
  if (hasRegion && identifiers.length > 0) {
    throw new Error('Compound object with region is not supported in v1');
  }

  if (!identifiers.length) {
    const literal = just(target);
    if (hasRegion) {
      return {
        kind: 'string',
        value: `${literal}[${object.region.x}.${object.region.y}.${object.region.width}.${object.region.height}]`,
      };
    }
    return { kind: 'string', value: literal };
  }

  let leaf: BcsArg;
  let wrappers: string[];

  if (isNothing(target)) {
    leaf = { kind: 'string', value: identifiers[identifiers.length - 1]! };
    wrappers = identifiers.slice(0, -1);
  }
  else {
    leaf = { kind: 'string', value: target };
    wrappers = identifiers;
  }

  for (let i = wrappers.length - 1; i >= 0; i--) {
    leaf = {
      kind: 'function',
      name: wrappers[i]!,
      args: [leaf],
    };
  }

  return leaf;
};
