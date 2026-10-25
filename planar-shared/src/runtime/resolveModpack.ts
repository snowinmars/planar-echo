import { isNothing } from '@/maybe.js';
import { canonicalHash } from './canonical.js';
import { tokenKey } from './types.js';

import type {
  FrozenLock,
  ModContract,
  ModpackManifest,
  WiredToken,
  Token
} from './types.js';

export type ResolveInput = Readonly<{
  manifest: ModpackManifest;
  contracts: ModContract[];
}>;

const assertExactMods = (manifest: ModpackManifest, contracts: ModContract[]): ModContract[] => {
  if (manifest.mods.length === 0) throw new Error('Modpack has no mods');

  const byId = new Map<string, ModContract>();
  for (const contract of contracts) {
    if (byId.has(contract.id)) throw new Error(`Duplicate mod id '${contract.id}'`);
    byId.set(contract.id, contract);
  }

  const resolved: ModContract[] = [];
  const seen = new Set<string>();
  for (const request of manifest.mods) {
    if (seen.has(request.id)) throw new Error(`Mod '${request.id}' is requested twice`);

    seen.add(request.id);

    const contract = byId.get(request.id);
    if (!contract) throw new Error(`Mod '${request.id}' is not in the catalog`);
    if (contract.version !== request.version) throw new Error(`Mod '${request.id}' resolved ${contract.version}, manifest requires ${request.version}`);

    resolved.push(contract);
  }

  for (const id of byId.keys()) {
    if (!seen.has(id)) throw new Error(`Mod '${id}' is not in the manifest`);
  }

  return resolved;
};

const assignKeys = <T extends Array<{ token: Token }>>(
  items: T,
): (T[number] & WiredToken)[] => {
  const sorted = [...items]
    .sort((lhs, rhs) => tokenKey(lhs.token).localeCompare(tokenKey(rhs.token)));

  const keys = sorted.map(({ token }) => tokenKey(token));
  const hasDuplicates = new Set(keys).size !== keys.length;
  if (hasDuplicates) throw new Error('Duplicate token');

  return sorted.map(item => ({
    ...item,
    key: tokenKey(item.token),
  }));
};

/**
 * Resolve after/before requests to actual order (topological sort).
 */
const orderSystems = (contracts: readonly ModContract[]): string[] => {
  const nodes = new Map<string, { after: Set<string>; before: Set<string> }>();

  // add top level
  for (const contract of contracts) {
    for (const system of contract.systems) {
      if (nodes.has(system.id)) throw new Error(`Duplicate system '${system.id}'`);
      nodes.set(system.id, { after: new Set(system.after), before: new Set(system.before) });
    }
  }

  // ensure exists + improve consistentcy
  for (const [id, node] of nodes) {
    for (const dep of [...node.after, ...node.before]) {
      if (!nodes.has(dep)) throw new Error(`System '${id}' depends on missing '${dep}'`);
    }

    for (const earlier of node.before) {
      const other = nodes.get(earlier);
      if (!other) throw new Error(`System '${earlier}' is missing`);
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
      incoming.set(id, incoming.get(id)! + 1);
      dependents.get(dep)!.push(id);
    }
  }

  const ready = [...nodes.keys()].filter(id => incoming.get(id)! === 0).sort();
  const ordered: string[] = [];
  while (ready.length > 0) {
    const next = ready.shift();

    if (isNothing(next)) throw new Error(`Found unexpected nothing during modpack dependency tree resolve`);

    ordered.push(next);

    const children = dependents.get(next)!;
    for (const child of children) {
      const count = incoming.get(child)! - 1;
      incoming.set(child, count);
      if (count === 0) {
        ready.push(child);
        ready.sort(); // resolve in strictly alphabetical order to ensure hash consistency
      }
    }
  }

  if (ordered.length !== nodes.size) throw new Error('Systems DAG has a cycle');

  return ordered;
};

export const resolveModpack = ({ manifest, contracts }: ResolveInput): FrozenLock => {
  const resolved = assertExactMods(manifest, contracts);

  const protocols = assignKeys(
    resolved.flatMap(x => [...x.protocols]),
  );

  const resources = assignKeys(
    resolved.flatMap(x => [...x.resources]),
  );

  const commands = assignKeys(
    resolved.flatMap(x => [...x.commands]),
  );

  const events = assignKeys(
    resolved.flatMap(x => [...x.events]),
  );

  const capabilities = assignKeys(
    resolved.flatMap(x => [...x.capabilities]),
  );

  const hasSeats = manifest.seats.length > 0;
  if (!hasSeats) throw new Error('Modpack has no seats');

  const keys = manifest.seats.map(({ principalId }) => principalId);
  const hasDuplicates = new Set(keys).size !== keys.length;
  if (hasDuplicates) throw new Error('Duplicate principal');

  const seats = manifest.seats.map((seat) => ({
    principalId: seat.principalId,
    commands: seat.commands.map((key) => {
      const command = commands.find(x => x.key === key);
      if (isNothing(command)) throw new Error(`Seat '${seat.principalId}' grants unknown command '${key}'`);
      return command.key;
    }),
  }));

  const body: Omit<FrozenLock, 'authoritativeDescriptorHash' | 'lockHash'> = {
    manifestId: manifest.id,
    manifestVersion: manifest.version,
    mods: resolved.map(({ id, version }) => ({ id, version })),
    protocols,
    resources,
    commands,
    events,
    capabilities,
    systems: orderSystems(resolved),
    seats,
  };

  const authoritativeDescriptorHash = canonicalHash(body);

  return {
    ...body,
    // TODO [snow] :Explain, why there are two hashes
    authoritativeDescriptorHash,
    lockHash: canonicalHash({ ...body, authoritativeDescriptorHash }),
  };
};
