import { just } from '../maybe.js';
import {
  isClientHookName,
  isComposedQueryName,
  isServerHookName,
  isSlotBoundQueryName,
  queryCardinalityOf,
  RADIO_SLOTS,
  REQUIRED_CLIENT_SLOTS,
  SERVER_QUERY_NAMES,
  slotOfQuery,
} from './modManifest.js';

import type {
  ActiveJsonMods,
  ClientHookName,
  ModId,
  ModManifest,
  QueryName,
  RadioSlot,
  ServerHookName,
} from './modManifest.js';

const isRadioSlot = (value: string): value is RadioSlot => (RADIO_SLOTS as readonly string[]).includes(value);

const isQueryName = (value: string): value is QueryName => SERVER_QUERY_NAMES.includes(value as typeof SERVER_QUERY_NAMES[number]);

const errifySlots = (slots: ActiveJsonMods['slots'], manifests: ReadonlyMap<ModId, ModManifest>): string[] => {
  const errors: string[] = [];

  for (const [slot, modId] of Object.entries(slots)) {
    if (!isRadioSlot(slot)) errors.push(`unknown slot '${slot}'`);

    if (!modId) {
      errors.push(`drop slot '${slot}' with empty array value.`);
      continue;
    }

    if (!manifests.has(modId)) errors.push(`slot '${slot}' lists unknown mod '${modId}'`);
  }

  return errors;
};

const errifyHookMap = (
  label: 'serverHooks' | 'clientHooks',
  hooks: Readonly<Partial<Record<string, ModId[]>>>,
  manifests: ReadonlyMap<ModId, ModManifest>,
  isName: (value: string) => boolean,
  side: 'server' | 'client',
): string[] => {
  const errors: string[] = [];

  for (const [hook, modIds] of Object.entries(hooks)) {
    if (!isName(hook)) {
      errors.push(`unknown ${label} hook '${hook}'`);
      continue;
    }

    if (!modIds) {
      errors.push(`drop ${label} '${hook}' with empty array value.`);
      continue;
    }

    for (const modId of modIds) {
      const manifest = manifests.get(modId);
      if (!manifest) {
        errors.push(`${label} '${hook}' lists unknown mod '${modId}'`);
        continue;
      }

      const wrongSide = !manifest.sides.includes(side);
      if (wrongSide) errors.push(`${label} '${hook}' lists non-${side} mod '${modId}'`);

      const undeclared = !manifest.hooks.includes(hook as ServerHookName | ClientHookName);
      if (undeclared) errors.push(`mod '${modId}' does not declare hook '${hook}'`);
    }
  }

  return errors;
};

const errifyQueries = (
  queries: ActiveJsonMods['queries'],
  manifests: ReadonlyMap<ModId, ModManifest>,
): string[] => {
  const errors: string[] = [];

  for (const [query, modIds] of Object.entries(queries)) {
    if (isSlotBoundQueryName(query)) {
      errors.push(`query '${query}' is bound to slot '${slotOfQuery(query)}'`);
      continue;
    }

    if (!isQueryName(query) || !isComposedQueryName(query)) {
      errors.push(`unknown query '${query}'`);
      continue;
    }

    if (!modIds) {
      errors.push(`drop query '${query}' with empty array value.`);
      continue;
    }

    const one = queryCardinalityOf(query) === 'one';
    const tooMany = one && modIds.length > 1;
    if (tooMany) {
      errors.push(`query '${query}' allows at most one mod, got '${modIds.join(', ')}'`);
      continue;
    }

    for (const modId of modIds) {
      const manifest = manifests.get(modId);
      if (!manifest) {
        errors.push(`query '${query}' lists unknown mod '${modId}'`);
        continue;
      }

      const undeclared = !manifest.queries.includes(query);
      if (undeclared) errors.push(`mod '${modId}' does not declare query '${query}'`);
    }
  }

  return errors;
};

const errifyEnabled = (enabled: ActiveJsonMods['enabled'], manifests: ReadonlyMap<ModId, ModManifest>): string[] => {
  const errors: string[] = [];

  for (const [modId, on] of Object.entries(enabled)) {
    if (!on) continue;

    const manifest = manifests.get(modId);
    if (!manifest) {
      errors.push(`enabled mod '${modId}' has no mod.json`);
      continue;
    }

    for (const requiredModId of manifest.requiredModIds) {
      if (!enabled[requiredModId]) errors.push(`required mod '${requiredModId}' for mod '${modId}' is not enabled`);
    }
  }

  return errors;
};

const errifyCycles = (enabled: ActiveJsonMods['enabled'], manifests: ReadonlyMap<ModId, ModManifest>): string[] => {
  const errors: string[] = [];

  // Black-grey-white tree traversal
  const seen = new Set<ModId>();
  const visiting = new Set<ModId>();

  const visit = (modId: ModId): void => {
    const alreadySeen = seen.has(modId);
    if (alreadySeen) return;

    const cycled = visiting.has(modId);
    if (cycled) {
      errors.push(`mod cycle detected at mod '${modId}'`);
      return;
    }

    visiting.add(modId);

    const manifest = just(manifests.get(modId));
    for (const dep of manifest.requiredModIds) visit(dep);

    visiting.delete(modId);
    seen.add(modId);
  };

  for (const [modId, on] of Object.entries(enabled)) if (on) visit(modId);

  return errors;
};

const formClaimedSlots = (enabled: ActiveJsonMods['enabled'], manifests: ReadonlyMap<ModId, ModManifest>): Map<RadioSlot, ModId[]> => {
  const claimed = new Map<RadioSlot, ModId[]>(RADIO_SLOTS.map(slot => [slot, []]));

  for (const [modId, manifest] of manifests) {
    if (!enabled[modId]) continue;

    for (const slot of manifest.slots) just(claimed.get(slot)).push(modId);
  }

  return claimed;
};

const errifyClaimedSlots = (slots: ActiveJsonMods['slots'], claimedSlots: Map<RadioSlot, ModId[]>, enabled: ActiveJsonMods['enabled'], manifests: ReadonlyMap<ModId, ModManifest>): string[] => {
  const errors: string[] = [];

  for (const slot of RADIO_SLOTS) {
    const claimantModIds = just(claimedSlots.get(slot));

    const conflict = claimantModIds.length > 1;
    if (conflict) {
      errors.push(`two mods claim the same slot '${slot}': ${claimantModIds.join(', ')}`);
      continue;
    }

    const assignedModId = slots[slot];
    const required = REQUIRED_CLIENT_SLOTS.includes(slot);

    const missing = !assignedModId && required;
    if (missing) {
      errors.push(`missing required client slot '${slot}'`);
      continue;
    }

    const brokenDeclaration = !assignedModId && claimantModIds.length === 1;
    if (brokenDeclaration) {
      errors.push(`mismatch between slot <-> enabled: mod '${claimantModIds[0]}' is enabled, but slot '${slot}' is empty`);
      continue;
    }

    if (!assignedModId) continue;

    if (!enabled[assignedModId]) {
      errors.push(`slot '${slot}' is assigned at mod '${assignedModId}', but the mod is disabled`);
      continue;
    }

    const manifest = just(manifests.get(assignedModId));
    const fullyCover = manifest.slots.includes(slot);
    if (!fullyCover) {
      errors.push(`mod '${assignedModId}' does not cover slot '${slot}'`);
      continue;
    }
  }

  return errors;
};

/**
 * Forbids to load a broken modpack.
 */
export const validateActiveJsonMods = (
  activeJson: ActiveJsonMods,
  manifests: ReadonlyMap<ModId, ModManifest>,
): string[] => {
  const errors: string[] = [];

  if (!activeJson.slots) errors.push('missing slots key: if you have no slots, set it to enpty object');
  if (!activeJson.serverHooks) errors.push('missing serverHooks key: if you have no server hooks, set it to enpty object');
  if (!activeJson.clientHooks) errors.push('missing clientHooks key: if you have no client hooks, set it to enpty object');
  if (!activeJson.queries) errors.push('missing queries key: if you have no queries, set it to enpty object');
  if (!activeJson.enabled) errors.push('missing enabled key: if you have no enabled, set it to enpty object');

  if (activeJson.slots) errors.push(...errifySlots(activeJson.slots, manifests));

  if (activeJson.serverHooks) {
    errors.push(...errifyHookMap('serverHooks', activeJson.serverHooks, manifests, isServerHookName, 'server'));
  }

  if (activeJson.clientHooks) {
    errors.push(...errifyHookMap('clientHooks', activeJson.clientHooks, manifests, isClientHookName, 'client'));
  }

  if (activeJson.queries) {
    errors.push(...errifyQueries(activeJson.queries, manifests));
  }

  if (activeJson.enabled) {
    errors.push(...errifyEnabled(activeJson.enabled, manifests));
    errors.push(...errifyCycles(activeJson.enabled, manifests));
  }

  if (activeJson.enabled && activeJson.slots) {
    const claimedSlots = formClaimedSlots(activeJson.enabled, manifests);
    errors.push(...errifyClaimedSlots(activeJson.slots, claimedSlots, activeJson.enabled, manifests));
  }

  return errors.map(x => `In active.json ${x}`);
};
