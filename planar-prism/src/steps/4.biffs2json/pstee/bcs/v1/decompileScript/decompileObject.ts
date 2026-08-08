import type { Ids } from '../../../ids/types.js';
import type { FunctionParam, SignatureFunction } from '../signatures.js';

import type { ParsedBcsObject, BcsPoint } from '../bytecodeTypes.js';
import { BITWISE_IDS, PST_OBJECT_TARGET_IDS, type DecompiledArg } from '../../types.js';
import { isNothing, just, nothing, type Maybe } from '@planar/shared';

type LookupIdsSymbolProps = Readonly<{
  ids: Map<string, Ids>;
  idsName: string;
  value: number;
}>;
export const lookupIdsSymbol = ({
  ids,
  idsName,
  value,
}: LookupIdsSymbolProps): Maybe<string> => {
  // TODO [snow]: lowercase is redundant?
  const key = idsName.toLowerCase().endsWith('.ids') ? idsName.toLowerCase() : `${idsName.toLowerCase()}.ids`;
  // .ids seems redundant

  // try both : align.ids + alignmen.ids
  const candidates = [key];
  if (idsName.toLowerCase() === 'align') {
    candidates.push('alignmen.ids');
  }
  if (idsName.toLowerCase() === 'alignmen') {
    candidates.push('align.ids');
  }

  for (const candidate of candidates) {
    const idsItem = ids.get(candidate);
    if (!idsItem) continue;
    const entries = idsItem.entries.get(value) ?? idsItem.entries.get(value >>> 0);
    if (entries && entries.length > 0) return just(entries[0]).toLowerCase();
  }
  return nothing();
};

type NumberBytecodeToJsonProps = Readonly<{
  value: number;
  param: FunctionParam;
  ids: Map<string, Ids>;
}>;
export const numberBytecodeToJson = ({
  value,
  param,
  ids,
}: NumberBytecodeToJsonProps): Readonly<{ kind: 'int'; value: number; symbol?: string }> => {
  const idsName = param.idsRef;
  if (!idsName) return { kind: 'int', value };

  const symbol = lookupIdsSymbol({
    ids,
    idsName,
    value,
  });
  if (!isNothing(symbol)) return { kind: 'int', value, symbol };

  if (BITWISE_IDS.has(idsName.toLowerCase())) {
    let remaining = value >>> 0;
    const parts: string[] = [];
    for (let bit = 0; bit < 32 && remaining > 0; bit += 1) {
      const mask = 1 << bit;
      if ((remaining & mask) === mask) {
        const bitSym = lookupIdsSymbol({
          ids,
          idsName,
          value: mask,
        });
        parts.push(bitSym ?? `0x${mask.toString(16)}`);
        remaining &= ~mask;
      }
    }
    if (parts.length > 0) {
      return { kind: 'int', value, symbol: parts.join(' | ') };
    }
  }

  return { kind: 'int', value };
};

/**
 * Split combined string slots (Global/SetGlobal area+name).
 * See buildBcsContext comment
 */
type SplitHalfOfAreaStringsProps = Readonly<{
  functionSignature: SignatureFunction;
  index: number;
  strings: Maybe<string>[];
}>;
export const splitHalfOfAreaStrings = ({
  functionSignature,
  index,
  strings,
}: SplitHalfOfAreaStringsProps): Maybe<string> => {
  let logicalStringIndex = 0;
  let physicalHalfIndex = 0;
  for (let i = 0; i < functionSignature.parameters.length; i += 1) {
    const p = functionSignature.parameters[i]!;

    if (p.type !== 's') continue;

    if (logicalStringIndex === index) {
      const physicalIndex = physicalHalfIndex >> 1;
      const s = strings[physicalIndex] ?? '';
      if (p.stringPack === 'halfOfArea6') {
        const isNameHalf = (physicalHalfIndex & 1) === 0;
        const pos = Math.min(6, s.length);
        return isNameHalf ? s.slice(pos) : s.slice(0, pos);
      }
      return s;
    }
    physicalHalfIndex += p.stringPack === 'halfOfArea6' ? 1 : 2;
    logicalStringIndex += 1;
  }
  if (index < strings.length) return strings[index] ?? nothing();
  throw new Error(`String parameter index ${index} out of range for ${functionSignature.name}`);
};

type BytecodeObjectToJsonProps = Readonly<{
  object: ParsedBcsObject;
  ids: Map<string, Ids>;
  useDefault: boolean;
}>;
const bytecodeObjectToJson = ({
  object,
  ids,
  useDefault, // TODO [snow]: is not used
}: BytecodeObjectToJsonProps): Maybe<string> => {
  const lastUsedIndex = object.target.findLastIndex(v => v !== 0);
  const empty = lastUsedIndex < 0;

  if (empty) return useDefault ? '[anyone]' : nothing();

  const parts: string[] = [];
  for (let i = 0; i < lastUsedIndex + 1; i += 1) { // TODO [snow]: check borders
    const idsName = PST_OBJECT_TARGET_IDS[i] ?? `target${i}`;
    const value = just(object.target[i]);
    if (value === 0) {
      parts.push('0');
      continue;
    }
    const symbol = lookupIdsSymbol({
      ids, idsName, value,
    });
    parts.push(symbol ?? String(value));
  }
  return `[${parts.join('.')}]`;
};

/**
 * Decode BcsObject into DecompiledArg:
 * - simple → kind string (myself, [anyone], ravel)
 * - compound OBJECT.IDS chain → kind function (for temps); leaf identifiers → string
 */
type ObjectToArgProps = Readonly<{
  object: ParsedBcsObject;
  ids: Map<string, Ids>;
}>;
export const objectToArg = ({
  object,
  ids,
}: ObjectToArgProps): DecompiledArg => {
  let target = bytecodeObjectToJson({
    object,
    ids,
    useDefault: false,
  });

  if (isNothing(target) && !isNothing(object.name) && object.name !== '') {
    target = object.name.toLowerCase();
  }

  const identifiers: string[] = [];
  const lastUsed = object.identifier.findLastIndex(v => v !== 0);

  for (let i = lastUsed; i >= 0; i--) {
    const value = object.identifier[i]!;
    if (value === 0) break;

    const symbol = lookupIdsSymbol({ ids, idsName: 'object', value });
    if (isNothing(symbol)) throw new Error(`Unknown OBJECT.IDS id ${value}`);

    identifiers.push(symbol);
  }

  if (isNothing(target) && identifiers.length === 0) target = '[anyone]';

  const hasRegion = !isNothing(object.region);

  if (hasRegion && identifiers.length > 0) throw new Error('Compound object with region is not supported in v1');

  if (!identifiers.length) {
    const literal = just(target);

    if (hasRegion) {
      return {
        kind: 'string',
        value: `${literal}[${object.region.x}.${object.region.y}.${object.region.width}.${object.region.height}]`.toLowerCase(),
      };
    }
    return { kind: 'string', value: literal.toLowerCase() };
  }

  // identifiers: outer → inner (NI order). Leaf without target is last identifier as string.
  let leaf: DecompiledArg;
  let wraps: string[];
  if (isNothing(target)) {
    leaf = { kind: 'string', value: identifiers[identifiers.length - 1]!.toLowerCase() };
    wraps = identifiers.slice(0, -1);
  }
  else {
    leaf = { kind: 'string', value: target.toLowerCase() };
    wraps = identifiers;
  }

  for (let i = wraps.length - 1; i >= 0; i--) {
    leaf = {
      kind: 'function',
      name: wraps[i]!,
      args: [leaf],
    };
  }

  return leaf;
};

export const isCompoundObject = (object: ParsedBcsObject): boolean => !object.identifier.every(v => v === 0);

export const isSimpleObject = (object: ParsedBcsObject): boolean => !isCompoundObject(object);

export const pointArg = (point: BcsPoint): DecompiledArg => ({
  kind: 'point',
  x: point.x,
  y: point.y,
});
