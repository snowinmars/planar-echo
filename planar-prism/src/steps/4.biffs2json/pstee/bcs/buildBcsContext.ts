import {
  BCS_REQUIRED_IDS,
  PST_STRING_PACKS_BY_ID,
} from './engineRules.js';
import { just, nothing, sleep } from '@planar/shared';
import {
  entryExists,
  loadFromFile,
  saveToFile,
} from '@/shared/customFs.js';

import type { Ids } from '../ids/types.js';
import type { BcsContext } from './buildBcsContext.types.js';
import type {
  FunctionParam,
  ParamType,
  SignatureFunction,
  Signatures,
} from './v1/signatures.types.js';

/**
 * Stamp each signature string parameter (s) with how it is stored in BCS bytecode.
 *
 * Problem: TRIGGER.IDS / ACTION.IDS describe *logical* arguments (e.g. SetGlobal has
 * separate S:Name and S:Area), but triggers/actions only have two physical string slots
 * (trigger t4/t5; action a8/a9).
 *
 * For many global-related functions the engine stores
 * "area" and "name" in *one* slot: a fixed 6-character area prefix plus the variable
 * name (e.g. "LOCALS" + "cd_int_0" → one field "LOCALScd_int_0"). The IDS line does not
 * say which functions pack strings this way; that ruleset is hardcoded per function id
 * (Near Infinity: ScriptInfo.functionConcatMap + Parameter.isCombinedString).
 *
 * I resolve that once when parsing IDS tails into FunctionParam[], so translation
 * can split slots without re-deriving masks.
 *
 * PST EE v1: only area6 packing (no colon-separated slots). Queues live in
 * PST_STRING_PACKS_BY_ID / PST_STRING_PACKS_A|B in ./engineRules.ts (ported from NI PST profile).
 *
 * Further reading:
 * - BCS wire format & string-slot limits:
 *   https://github.com/NearInfinityBrowser/NearInfinity/blob/master/src/org/infinity/resource/bcs/BcsResource.java
 *   (class javadoc: actions/triggers, two string slots, concatenated Global/SetGlobal area+name)
 *
 * - Per-function concat rules (isCombinedString / isColonSeparatedString):
 *   https://github.com/NearInfinityBrowser/NearInfinity/blob/master/src/org/infinity/resource/bcs/ScriptInfo.java
 *
 * - Runtime split of a packed slot when decompiling:
 *   https://github.com/NearInfinityBrowser/NearInfinity/blob/master/src/org/infinity/resource/bcs/BcsStructureBase.java
 *   (getStringParam)
 *
 * - IESDP BCS overview:
 *   https://gibberlings3.ithacus.com/iesdp/file_formats/ie_formats/bcs_v1.htm
 */
const assignStringPacks = (id: number, parameters: FunctionParam[]): FunctionParam[] => {
  const packs = PST_STRING_PACKS_BY_ID.get(id);

  let index = 0;

  return parameters
    .map((p) => {
      const isString = p.type === 's';
      if (!isString) return p;

      const isCommonParameter = !packs;
      if (isCommonParameter) return { ...p, stringPack: 'plain' };

      const stringPack = just(packs[index]);
      index++;
      return { ...p, stringPack };
    });
};

const validateType = (x: string): ParamType => {
  switch (x) {
    case 'a':
    case 't':
    case 'i':
    case 'o':
    case 'p':
    case 's':
      return x;
    default: throw new Error(`Out of range ParamType for bcs function: '${x}'`);
  }
};

const parseParameters = (param: string, id: number): FunctionParam[] => {
  const result = param
    .split(',')
    .map((arg) => {
      const [rawType, subtype] = arg.split(':').map(x => x.trim());
      if (!rawType) throw new Error(`Wrong format of '${arg}': cannot find the type of an argument`);
      if (!subtype) throw new Error(`Wrong format of '${arg}': cannot find the subtype of an argument`);

      const [tag, idsRef] = subtype.split('*').map(x => x.trim());
      if (!tag) throw new Error(`Wrong format of '${arg}': cannot find the tag of an argument`);
      // idsRef can be empty

      const type = validateType(rawType);

      const parameter: FunctionParam = {
        type,
        tag,
        idsRef: idsRef ? idsRef : nothing(),
        stringPack: 'plain',
      };

      return parameter;
    });

  return assignStringPacks(id, result);
};

const parseSignatureRegex = /^([^(]*)\((.*)\)/;
const parseSignature = (
  id: number,
  tail: string,
  resourceName: string,
): SignatureFunction => {
  const match = parseSignatureRegex.exec(tail);
  if (!match) throw new Error(`Wrong signature syntax at '${tail}' (id='${id}', resource='${resourceName}')`);

  const name = match[1];
  const brackets = match[2]; // without brackets itself, 'args' name is too generic
  if (!name) throw new Error(`Cannot parse signature name from '${tail}' (id='${id}', resource='${resourceName}')`);
  // brackets can be empty, if a function has no args

  const parameters = brackets ? parseParameters(brackets, id) : [];
  return {
    id,
    name,
    parameters,
  };
};

const parseSignatures = (ids: Ids): Signatures => {
  // See https://github.com/NearInfinityBrowser/NearInfinity/blob/master/src/org/infinity/resource/bcs/ScriptInfo.java
  // about what is going on
  const byId = new Map<number, SignatureFunction[]>();

  for (const [id, tails] of ids.entries) {
    for (const tail of tails) {
      const signature = parseSignature(id, tail, ids.resourceName);

      const list = byId.get(signature.id) ?? [];
      list.push(signature);
      byId.set(signature.id, list);
    }
  }

  return {
    resource: ids.resourceName,
    byId,
  };
};

const parseXorKey = (code: string): number[] => {
  const keyBlockMatch = code.match(/KEY\s*=\s*\{([\s\S]*?)\}/);
  if (!keyBlockMatch || !keyBlockMatch[1]) throw new Error(`Cannot find InfinityEngine xorKey from NearInfinity sources`);

  const hexValues = keyBlockMatch[1].match(/0x[0-9a-fA-F]+/g);
  if (!hexValues) throw new Error(`Cannot find hex values in the InfinityEngine xorKey from NearInfinity sources`);

  const numbers = hexValues.map(hex => parseInt(hex, 16));
  if (numbers.length !== 64 || numbers.some(x => isNaN(x))) throw new Error('Got broken value of the InfinityEngine xorKey from NearInfinity sources');

  return numbers;
};

const XOR_KEY_LENGTH = 64;
const isXorKey = (value: unknown): value is number[] =>
  Array.isArray(value)
  && value.length === XOR_KEY_LENGTH
  && value.every(item => typeof item === 'number' && Number.isFinite(item));

const XOR_KEY_FETCH_ATTEMPTS = 3;
const XOR_KEY_FETCH_RETRY_DELAY_MS = 1000;
const fetchXorKey = async (): Promise<number[]> => {
  const url = 'https://raw.githubusercontent.com/NearInfinityBrowser/NearInfinity/master/src/org/infinity/util/StaticSimpleXorDecryptor.java';
  let lastError: unknown = new Error('Could not load InfinityEngine xor key');

  for (let attempt = 0; attempt < XOR_KEY_FETCH_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not load InfinityEngine xorKey: HTTP ${response.status}`);

      return parseXorKey(await response.text());
    }
    catch (error: unknown) {
      lastError = error;
      const hasMoreAttempts = attempt + 1 < XOR_KEY_FETCH_ATTEMPTS;
      if (hasMoreAttempts) await sleep(XOR_KEY_FETCH_RETRY_DELAY_MS);
    }
  }

  throw lastError;
};

const loadXorKey = async (cachePath: string): Promise<number[]> => {
  const cacheExists = await entryExists(cachePath);
  if (cacheExists) {
    try {
      const cached = await loadFromFile<unknown>(cachePath);
      if (isXorKey(cached)) return cached;
    }
    catch {
      // Invalid cache is treated as a miss and replaced after a successful fetch.
    }
  }

  const xorKey = await fetchXorKey();
  await saveToFile(cachePath, xorKey);
  return xorKey;
};

export const buildBcsContext = async (
  ids: Map<string, Ids>,
  xorKeyCachePath: string,
): Promise<BcsContext> => {
  for (const must of BCS_REQUIRED_IDS) if (!ids.has(must)) throw new Error(`BCS parser requires '${must}' to be in ids map`);

  const xorKey = await loadXorKey(xorKeyCachePath);

  return {
    triggerSignatures: parseSignatures(ids.get('trigger.ids')!),
    actionSignatures: parseSignatures(ids.get('action.ids')!),
    ids,
    xorKey,
  };
};
