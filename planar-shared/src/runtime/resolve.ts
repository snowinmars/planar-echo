import { canonicalHash } from './canonical.js';
import { tokenKey } from './types.js';

import type {
  FrozenLock,
  ModContract,
  ModpackManifest,
  WiredToken,
} from './types.js';

export type ResolveInput = Readonly<{
  manifest: ModpackManifest;
  contracts: readonly ModContract[];
}>;

const assertExactMods = (manifest: ModpackManifest, contracts: readonly ModContract[]): ModContract[] => {
  const byId = new Map<string, ModContract>();
  for (const contract of contracts) {
    if (byId.has(contract.id)) throw new Error(`Duplicate mod id "${contract.id}"`);
    byId.set(contract.id, contract);
  }
  if (manifest.mods.length === 0) throw new Error('Modpack has no mods');
  const resolved: ModContract[] = [];
  const seen = new Set<string>();
  for (const request of manifest.mods) {
    if (seen.has(request.id)) throw new Error(`Mod "${request.id}" is requested twice`);
    seen.add(request.id);
    const contract = byId.get(request.id);
    if (!contract) throw new Error(`Mod "${request.id}" is not in the catalog`);
    if (contract.version !== request.version) {
      throw new Error(`Mod "${request.id}" resolved ${contract.version}, manifest requires ${request.version}`);
    }
    resolved.push(contract);
  }
  return resolved;
};

const assignWire = <T extends { token: { id: string; version: number } }, E extends object>(
  items: readonly T[],
  extra: (item: T) => E,
): (T & E & WiredToken)[] => {
  const sorted = [...items].sort((left, right) => tokenKey(left.token).localeCompare(tokenKey(right.token)));
  const used = new Set<string>();
  return sorted.map((item, index) => {
    const key = tokenKey(item.token);
    if (used.has(key)) throw new Error(`Duplicate token "${key}"`);
    used.add(key);
    return { ...item, ...extra(item), key, wireId: index + 1 };
  });
};

const orderSystems = (contracts: readonly ModContract[]): string[] => {
  const nodes = new Map<string, { after: Set<string>; before: Set<string> }>();
  for (const contract of contracts) {
    for (const system of contract.systems) {
      if (nodes.has(system.id)) throw new Error(`Duplicate system "${system.id}"`);
      nodes.set(system.id, { after: new Set(system.after), before: new Set(system.before) });
    }
  }
  for (const [id, node] of nodes) {
    for (const dep of [...node.after, ...node.before]) {
      if (!nodes.has(dep)) throw new Error(`System "${id}" depends on missing "${dep}"`);
    }
    for (const earlier of node.before) {
      const other = nodes.get(earlier);
      if (!other) throw new Error(`System "${earlier}" is missing`);
      other.after.add(id);
    }
  }
  const incoming = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  for (const id of nodes.keys()) {
    incoming.set(id, 0);
    dependents.set(id, []);
  }
  for (const [id, node] of nodes) {
    for (const dep of node.after) {
      incoming.set(id, (incoming.get(id) ?? 0) + 1);
      dependents.get(dep)?.push(id);
    }
  }
  const ready = [...nodes.keys()].filter(id => (incoming.get(id) ?? 0) === 0).sort();
  const ordered: string[] = [];
  while (ready.length > 0) {
    const next = ready.shift();
    if (next === undefined) break;
    ordered.push(next);
    const children = dependents.get(next) ?? [];
    for (const child of children) {
      const count = (incoming.get(child) ?? 0) - 1;
      incoming.set(child, count);
      if (count === 0) {
        ready.push(child);
        ready.sort();
      }
    }
  }
  if (ordered.length !== nodes.size) throw new Error('Systems DAG has a cycle');
  return ordered;
};

export const resolveModpack = (input: ResolveInput): FrozenLock => {
  const contracts = assertExactMods(input.manifest, input.contracts);
  const protocols = assignWire(
    contracts.flatMap(contract => [...contract.protocols]),
    item => ({ replication: item.replication }),
  );
  const resources = assignWire(
    contracts.flatMap(contract => [...contract.resources]),
    item => ({ replication: item.replication }),
  );
  const commands = assignWire(contracts.flatMap(contract => [...contract.commands]), () => ({}));
  const events = assignWire(contracts.flatMap(contract => [...contract.events]), () => ({}));
  const capabilities = assignWire(
    contracts.flatMap(contract => [...contract.capabilities]),
    item => ({ cardinality: item.cardinality }),
  );
  const commandWire = new Map(commands.map(command => [command.key, command.wireId]));
  if (input.manifest.seats.length === 0) throw new Error('Modpack has no seats');
  const principals = new Set<string>();
  const seats = input.manifest.seats.map((seat) => {
    if (principals.has(seat.principalId)) throw new Error(`Duplicate principal "${seat.principalId}"`);
    principals.add(seat.principalId);
    return {
      principalId: seat.principalId,
      commands: seat.commands.map((key) => {
        const wireId = commandWire.get(key);
        if (wireId === undefined) throw new Error(`Seat "${seat.principalId}" grants unknown command "${key}"`);
        return wireId;
      }),
    };
  });
  const body = {
    manifestId: input.manifest.id,
    manifestVersion: input.manifest.version,
    mods: contracts.map(contract => ({ id: contract.id, version: contract.version })),
    protocols,
    resources,
    commands,
    events,
    capabilities,
    systems: orderSystems(contracts),
    seats,
  };
  const authoritativeDescriptorHash = canonicalHash(body);
  return {
    ...body,
    authoritativeDescriptorHash,
    lockHash: canonicalHash({ ...body, authoritativeDescriptorHash }),
  };
};
