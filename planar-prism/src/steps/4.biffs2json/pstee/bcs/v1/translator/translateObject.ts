import { isNothing, just, nothing } from '@planar/shared';

import logger from '@/shared/logger.js';

import { PSTEE_OBJECT_TARGET_IDS } from '../../context/buildBcsContext.const.js';
import { lookupIdsSymbol } from './lookupIdsSymbol.js';

import type { Maybe } from '@planar/shared';

import type { RawIds } from '../../../ids/parseIds.types.js';
import type { RawBcsArg } from '../../context/buildBcsContext.types.js';
import type { RawBcsObject } from '../bytecode/parseOb.types.js';

type TranslateTargetProps = Readonly<{
  resourceName: string;
  object: RawBcsObject;
  ids: Map<string, RawIds>;
}>;
const translateTarget = ({
  resourceName,
  object,
  ids,
}: TranslateTargetProps): Maybe<string> => {
  const lastUsedIndex = object.target.findLastIndex(value => value !== 0);
  if (lastUsedIndex < 0) return nothing();

  const parts: string[] = [];
  for (let i = 0; i < object.target.length; i++) {
    const idsName = PSTEE_OBJECT_TARGET_IDS[i] ?? `target${i}`;
    const value = just(object.target[i]);

    if (value === 0) {
      parts.push('0');
      continue;
    }

    const symbol = lookupIdsSymbol({
      resourceName,
      ids,
      idsName,
      value,
    });
    if (isNothing(symbol)) {
      logger.warn(`BCS object target: '${value}' not found in '${idsName}'.ids for resource '${resourceName}'`);
      parts.push(String(value));
      continue;
    }

    parts.push(symbol);
  }

  return `[${parts.join('.')}]`;
};

type BcsStringFunctionArg = Extract<RawBcsArg, { kind: 'string' | 'function' }>;
type TranslateObjectProps = Readonly<{
  resourceName: string;
  object: RawBcsObject;
  ids: Map<string, RawIds>;
}>;
export const translateObject = ({
  resourceName,
  object,
  ids,
}: TranslateObjectProps): BcsStringFunctionArg => {
  let target = translateTarget({
    resourceName,
    object,
    ids,
  });

  if (isNothing(target) && !isNothing(object.name) && object.name !== '') {
    target = object.name;
  }

  const identifiers: string[] = [];
  const lastUsed = object.identifier.findLastIndex(value => value !== 0);

  for (let i = lastUsed; i >= 0; i--) {
    const value = object.identifier[i]!;
    if (value === 0) break;

    const symbol = lookupIdsSymbol({
      resourceName,
      ids,
      idsName: 'object',
      value,
    });
    if (isNothing(symbol)) throw new Error(`Unknown OBJECT.IDS id '${value}' for resource '${resourceName}'`);
    identifiers.push(symbol);
  }

  if (isNothing(target) && identifiers.length === 0) target = '[anyone]';

  const hasRegion = !isNothing(object.region);
  if (hasRegion && identifiers.length > 0) {
    throw new Error(`Compound object with region is not supported in v1 for resource '${resourceName}'`);
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

  let leaf: RawBcsArg;
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
