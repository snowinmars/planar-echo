import { isNothing, just, nothing } from '@planar/shared';
import { PST_OBJECT_TARGET_IDS } from '../../engineRules.js';
import { lookupIdsSymbol } from './lookupIdsSymbol.js';

import type { Maybe } from '@planar/shared';
import type { Ids } from '../../../ids/types.js';
import type { BcsArg, BcsObjectQuery } from '../../parseBcs.types.js';
import type { ParsedBcsObject } from '../bytecode.types.js';

const normalizeWhoId = (raw: string): string => {
  const value = raw.trim().toLowerCase().replaceAll(`'`, '').replaceAll(`"`, '');
  if (!value) return value;

  if (value === 'myself') return 'myself';
  if (value === '[pc]' || value === 'pc' || value === 'protagonist') return 'protagonist';

  const player = /^player\d+$/.exec(value);
  if (player) return 'protagonist';

  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1);
    if (inner === 'pc') return 'protagonist';
    if (inner === 'anyone') return 'anyone';
  }

  return value;
};

type FieldSymbol = Readonly<{ field: (typeof PST_OBJECT_TARGET_IDS)[number]; symbol: string }>;

const collectTargetFields = (
  object: ParsedBcsObject,
  ids: Map<string, Ids>,
): FieldSymbol[] => {
  const fields: FieldSymbol[] = [];
  for (let i = 0; i < PST_OBJECT_TARGET_IDS.length; i++) {
    const value = object.target[i] ?? 0;
    if (value === 0) continue;
    const field = PST_OBJECT_TARGET_IDS[i]!;
    const symbol = lookupIdsSymbol(ids, field, value);
    fields.push({ field, symbol: isNothing(symbol) ? String(value) : just(symbol) });
  }
  return fields;
};

const fieldsToQuery = (fields: FieldSymbol[]): BcsObjectQuery => {
  const query: {
    ea?: string;
    faction?: string;
    team?: string;
    general?: string;
    race?: string;
    class?: string;
    specific?: string;
    gender?: string;
    align?: string;
  } = {};
  for (const { field, symbol } of fields) {
    query[field] = symbol;
  }
  return query;
};

type BcsObjectArg = Extract<BcsArg, { kind: 'who' | 'query' | 'string' | 'function' }>;

export const translateObject = (
  object: ParsedBcsObject,
  ids: Map<string, Ids>,
  specificToWhoId: ReadonlyMap<string, string> = new Map(),
): BcsObjectArg => {
  const identifiers: string[] = [];
  const lastUsed = object.identifier.findLastIndex(value => value !== 0);

  for (let i = lastUsed; i >= 0; i--) {
    const value = object.identifier[i]!;
    if (value === 0) break;

    const symbol = lookupIdsSymbol(ids, 'object', value);
    if (isNothing(symbol)) throw new Error(`Unknown OBJECT.IDS id ${value}`);
    identifiers.push(just(symbol));
  }

  const hasName = !isNothing(object.name) && object.name !== '';
  const name: Maybe<string> = hasName ? normalizeWhoId(just(object.name)) : nothing();
  const fields = collectTargetFields(object, ids);
  const hasRegion = !isNothing(object.region);

  // Named object without filters/selectors
  if (!isNothing(name) && fields.length === 0 && identifiers.length === 0) {
    if (hasRegion) {
      return {
        kind: 'string',
        value: `${just(name)}[${object.region.x}.${object.region.y}.${object.region.width}.${object.region.height}]`,
      };
    }
    return { kind: 'who', value: just(name) };
  }

  // Filter-only object
  if (fields.length > 0 && identifiers.length === 0 && isNothing(name)) {
    if (fields.length === 1 && fields[0]!.field === 'specific') {
      const whoId = specificToWhoId.get(fields[0]!.symbol);
      if (whoId) return { kind: 'who', value: whoId };
    }
    if (fields.length === 1 && fields[0]!.field === 'ea') {
      const ea = fields[0]!.symbol;
      if (ea === 'pc' || ea === 'protagonist') return { kind: 'who', value: 'protagonist' };
    }
    return { kind: 'query', value: fieldsToQuery(fields) };
  }

  // Name wins over filters when both present and no selectors
  if (!isNothing(name) && identifiers.length === 0) {
    return { kind: 'who', value: just(name) };
  }

  if (identifiers.length === 0) {
    return { kind: 'who', value: 'anyone' };
  }

  let leaf: BcsArg;
  let wrappers: string[];

  if (fields.length === 0 && isNothing(name)) {
    // Myself / NearestEnemyOf as identifier chain
    leaf = { kind: 'who', value: identifiers[identifiers.length - 1]! };
    wrappers = identifiers.slice(0, -1);
  }
  else if (!isNothing(name)) {
    leaf = { kind: 'who', value: just(name) };
    wrappers = identifiers;
  }
  else if (fields.length === 1 && fields[0]!.field === 'specific' && specificToWhoId.has(fields[0]!.symbol)) {
    leaf = { kind: 'who', value: just(specificToWhoId.get(fields[0]!.symbol)) };
    wrappers = identifiers;
  }
  else if (fields.length > 0) {
    leaf = { kind: 'query', value: fieldsToQuery(fields) };
    wrappers = identifiers;
  }
  else {
    leaf = { kind: 'who', value: 'anyone' };
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
