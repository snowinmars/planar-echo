import {
  CLIENT_HOOKS,
  MOD_SIDES,
  RADIO_SLOTS,
  SERVER_HOOKS,
  SERVER_QUERIES,
  SERVER_QUERY_NAMES,
} from './modManifest.js';

import type {
  ClientHookName,
  HookName,
  ModManifest,
  ModSide,
  QueryName,
  RadioSlot,
  ServerHookName,
} from './modManifest.js';

const MANIFEST_KEYS = ['id', 'version', 'sides', 'slots', 'hooks', 'queries', 'requiredModIds'] as const;
const OPTIONAL_KEYS = ['description'] as const;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isModSide = (value: string): value is ModSide => (MOD_SIDES).includes(value as typeof MOD_SIDES[number]);
const isRadioSlot = (value: string): value is RadioSlot => (RADIO_SLOTS).includes(value as typeof RADIO_SLOTS[number]);
const isServerHook = (value: string): value is ServerHookName => (SERVER_HOOKS).includes(value as typeof SERVER_HOOKS[number]);
const isClientHook = (value: string): value is ClientHookName => (CLIENT_HOOKS).includes(value as typeof CLIENT_HOOKS[number]);
const isHookName = (value: string): value is HookName => isServerHook(value) || isClientHook(value);
const isQueryName = (value: string): value is QueryName => (SERVER_QUERY_NAMES as readonly string[]).includes(value);
const hookFitsSides = (hook: HookName, sides: readonly ModSide[]): boolean => {
  const server = isServerHook(hook) && sides.includes('server');
  const client = isClientHook(hook) && sides.includes('client');

  return server || client;
};

const parseNonEmptyString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || value === '') throw new Error(`'${field}' must be a non-empty string`);
  return value;
};

const parseStringList = (value: unknown, field: string): string[] => {
  if (!Array.isArray(value)) throw new Error(`'${field}' must be an array`);

  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item !== 'string' || item === '') throw new Error(`'${field}' entries must be non-empty strings`);
    if (seen.has(item)) throw new Error(`duplicate '${item}' in '${field}'`);

    seen.add(item);
  }

  return [...seen];
};

const parseSides = (sides: unknown): ModSide[] => {
  const sidesRaw = parseStringList(sides, 'sides');
  const noModSide = sidesRaw.length === 0;
  if (noModSide) throw new Error(`'sides' must not be empty`);

  const out: ModSide[] = [];
  for (const side of sidesRaw) {
    if (!isModSide(side)) throw new Error(`unknown side '${side}'`);
    out.push(side);
  }

  return out;
};

const parseSlots = (slots: unknown): RadioSlot[] => {
  const slotsRaw = parseStringList(slots, 'slots');
  // slots may be empty

  const out: RadioSlot[] = [];
  for (const slot of slotsRaw) {
    if (!isRadioSlot(slot)) throw new Error(`unknown slot '${slot}'`);
    out.push(slot);
  }

  return out;
};

const parseHooks = (hooks: unknown, sides: ModSide[]): HookName[] => {
  const hooksRaw = parseStringList(hooks, 'hooks');
  // hooks may be empty

  const out: HookName[] = [];
  for (const hook of hooksRaw) {
    if (!isHookName(hook)) throw new Error(`unknown hook '${hook}'`);
    if (!hookFitsSides(hook, sides)) throw new Error(`hook '${hook}' does not match sides [${sides.join(', ')}]`);
    out.push(hook);
  }

  return out;
};

const parseQueries = (queries: unknown): QueryName[] => {
  const queriesRaw = parseStringList(queries, 'queries');
  // queries may be empty

  const out: QueryName[] = [];
  for (const query of queriesRaw) {
    if (!isQueryName(query)) throw new Error(`unknown query '${query}'`);
    // TODO [snow]: here is the big issue.
    // Queries are not server-only flow: client may want to have its own queries.
    // But for now I do not have an example, so this whole flow may be rewritten as client queries will be born
    out.push(query);
  }

  return out;
};

const assertSlotBoundQueries = (
  slots: RadioSlot[],
  queries: QueryName[],
  sides: ModSide[],
): void => {
  for (const spec of SERVER_QUERIES) {
    if (!('slot' in spec)) continue;

    const declared = queries.includes(spec.name);
    const claimsSlot = slots.includes(spec.slot);

    const orphanQuery = declared && !claimsSlot;
    if (orphanQuery) {
      throw new Error(`query '${spec.name}' is bound to slot '${spec.slot}'`);
    }

    const claimsWithoutQuery = claimsSlot && !declared;
    if (claimsWithoutQuery) {
      throw new Error(`slot '${spec.slot}' requires query '${spec.name}'`);
    }

    const claimsWithoutServer = claimsSlot && !sides.includes('server');
    if (claimsWithoutServer) {
      throw new Error(`slot '${spec.slot}' requires server side`);
    }
  }
};

export const parseModManifest = (raw: unknown): ModManifest => {
  if (!isRecord(raw)) throw new Error('mod.json must be an object');

  for (const key of Object.keys(raw)) {
    const knownKey = (MANIFEST_KEYS).includes(key as typeof MANIFEST_KEYS[number]);
    const optionalKey = (OPTIONAL_KEYS).includes(key as typeof OPTIONAL_KEYS[number]);
    if (!knownKey && !optionalKey) throw new Error(`unknown key '${key}'`);
  }

  for (const key of MANIFEST_KEYS) {
    const existingKey = key in raw;
    if (!existingKey) throw new Error(`missing key '${key}'`);
  }

  const id = parseNonEmptyString(raw.id, 'id');
  const version = parseNonEmptyString(raw.version, 'version');

  const sides = parseSides(raw.sides);
  const slots = parseSlots(raw.slots);
  const hooks = parseHooks(raw.hooks, sides);
  const queries = parseQueries(raw.queries);
  assertSlotBoundQueries(slots, queries, sides);

  const requiredModIds = parseStringList(raw.requiredModIds, 'requiredModIds');

  return {
    id,
    version,
    sides,
    slots,
    hooks,
    queries,
    requiredModIds,
  };
};
