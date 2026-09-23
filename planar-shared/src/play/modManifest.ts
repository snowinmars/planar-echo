import type { Maybe } from '../maybe.js';

/**
 * Slots that cannot stack: at most one enabled mod per the slot.
 * F.e., two pathing mods would both eat clicks and write pos - that's just wrong.
 *
 * Some mods, like debug overlays - f.e., paint-cell, - do not take a slot, as there can be many of them.
 */
export const RADIO_SLOTS = [
  'actorRender',
  'areaRender',
  'collision',
  'doors',
  'pathing',
  'populate',
  'travel',
] as const;
export type RadioSlot = (typeof RADIO_SLOTS)[number];

export const REQUIRED_CLIENT_SLOTS: RadioSlot[] = ['areaRender', 'actorRender'];

export const MOD_SIDES = ['client', 'server'] as const;
export type ModSide = (typeof MOD_SIDES)[number];

/**
 * Hooks the daemon will look up on server.js.
 */
export const SERVER_HOOKS = [
  'onAreaLoad',
  'onAreaUnload',
  'onCommand',
  'onTick',
] as const;
export type ServerHookName = (typeof SERVER_HOOKS)[number];

export type QueryCardinality = 'one' | 'many';

/**
 * Pull queries: derived views, not simulation phases. No WorldEffect.
 *
 * Composed queries are listed in active.json.
 * Slot-bound queries are dispatched from slots.<slot>; they must not appear in active.queries.
 */
export const SERVER_QUERIES = [
  { name: 'floorOverlay', cardinality: 'many' },
  { name: 'occupancy', slot: 'collision' },
] as const;

type ServerQuerySpec = (typeof SERVER_QUERIES)[number];
export type QueryName = ServerQuerySpec['name'];
export type ComposedQueryName = Extract<ServerQuerySpec, { cardinality: QueryCardinality }>['name'];
export type SlotBoundQueryName = Extract<ServerQuerySpec, { slot: RadioSlot }>['name'];

export const SERVER_QUERY_NAMES: readonly QueryName[] = SERVER_QUERIES.map(({ name }) => name);

const isComposedSpec = (
  query: ServerQuerySpec,
): query is Extract<ServerQuerySpec, { cardinality: QueryCardinality }> => 'cardinality' in query;

const isSlotBoundSpec = (
  query: ServerQuerySpec,
): query is Extract<ServerQuerySpec, { slot: RadioSlot }> => 'slot' in query;

export const COMPOSED_QUERY_NAMES: readonly ComposedQueryName[] = SERVER_QUERIES
  .filter(isComposedSpec)
  .map(query => query.name);

export const SLOT_BOUND_QUERY_NAMES: readonly SlotBoundQueryName[] = SERVER_QUERIES
  .filter(isSlotBoundSpec)
  .map(query => query.name);

export const isComposedQueryName = (value: string): value is ComposedQueryName => (
  (COMPOSED_QUERY_NAMES as readonly string[]).includes(value)
);

export const isSlotBoundQueryName = (value: string): value is SlotBoundQueryName => (
  (SLOT_BOUND_QUERY_NAMES as readonly string[]).includes(value)
);

export const queryCardinalityOf = (name: ComposedQueryName): QueryCardinality => {
  for (const query of SERVER_QUERIES) {
    if (!isComposedSpec(query)) continue;

    const match = query.name === name;
    if (match) return query.cardinality;
  }

  throw new Error(`unknown composed query '${name}'`);
};

export const slotOfQuery = (name: SlotBoundQueryName): RadioSlot => {
  for (const query of SERVER_QUERIES) {
    if (!isSlotBoundSpec(query)) continue;

    const match = query.name === name;
    if (match) return query.slot;
  }

  throw new Error(`query '${name}' is not slot-bound`);
};

/**
 * Hooks the shell will look up on client.js.
 */
export const CLIENT_HOOKS = [
  'onAreaLoad',
  'onAreaUnload',
  'onPatches',
  'onFrame',
] as const;
export type ClientHookName = (typeof CLIENT_HOOKS)[number];

export type HookName = ServerHookName | ClientHookName;

export const isServerHookName = (value: string): value is ServerHookName => (
  (SERVER_HOOKS).includes(value as typeof SERVER_HOOKS[number])
);

export const isClientHookName = (value: string): value is ClientHookName => (
  (CLIENT_HOOKS).includes(value as typeof CLIENT_HOOKS[number])
);

/**
 * Type of `{modId}/mod.json` file.
 */
export type ModId = string;
export type ModManifest = Readonly<{
  id: ModId;
  version: string;
  sides: ModSide[];
  slots: RadioSlot[];
  hooks: HookName[];
  queries: QueryName[];
  requiredModIds: ModId[];
}>;

/**
 * Type of `{modsDir}/active.json` file.
 */
export type ActiveJsonMods = Readonly<{
  slots: Readonly<Partial<Record<RadioSlot, Maybe<ModId>>>>;
  enabled: Readonly<Record<ModId, boolean>>;
  serverHooks: Readonly<Partial<Record<ServerHookName, ModId[]>>>;
  clientHooks: Readonly<Partial<Record<ClientHookName, ModId[]>>>;
  queries: Readonly<Partial<Record<ComposedQueryName, ModId[]>>>;
}>;
