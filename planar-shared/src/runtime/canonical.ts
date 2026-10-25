import { isRecord } from "@/isRecord.js";

const MAX_DEPTH = 32;

export const canonicalString = (value: unknown, depth = 0): string => {
  if (depth > MAX_DEPTH) throw new Error('Canonical value is too deep');

  if (value === null) return 'null';

  if (typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Canonical numbers must be finite');
    return JSON.stringify(value);
  }

  if (typeof value === 'bigint' || typeof value === 'function' || typeof value === 'symbol' || value === undefined) {
    throw new Error('Canonical value contains a non-data type');
  }

  if (Array.isArray(value)) {
    return `[${value.map(item => canonicalString(item, depth + 1)).join(',')}]`;
  }

  if (!isRecord(value)) throw new Error('Canonical value is not data');

  const keys = Object.keys(value).sort();
  const body = keys.map((key) => {
    const child = value[key];
    if (child === undefined) throw new Error(`Canonical object key '${key}' is undefined`);
    return `${JSON.stringify(key)}:${canonicalString(child, depth + 1)}`;
  });

  return `{${body.join(',')}}`;
};

const FNV_OFFSET = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const FNV_MASK = 0xffffffffffffffffn;

export const fnv1a64 = (text: string): string => {
  let hash = FNV_OFFSET;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= BigInt(text.charCodeAt(index));
    hash = (hash * FNV_PRIME) & FNV_MASK;
  }
  return hash.toString(16).padStart(16, '0');
};

export const canonicalHash = (value: unknown): string => fnv1a64(canonicalString(value));
