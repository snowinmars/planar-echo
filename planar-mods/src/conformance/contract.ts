import type { ModContract, ModpackManifest } from '@planar/shared';

export const TRANSFORM = 'planar.conformance/transform@1';
export const INTENTS = 'planar.conformance/intents@1';
export const MOVE = 'planar.conformance/move@1';
export const MOVED = 'planar.conformance/moved@1';
export const INTEGRATE = 'planar.conformance/integrate@1';
export const BOUNDS = 'planar.conformance/render@1';

export const STEP = 12;
export const WORLD = 480;

export const conformanceContract = {
  id: 'planar.conformance.dot',
  version: '1.0.0',
  protocols: [{
    kind: 'protocol',
    token: { id: 'planar.conformance/transform', version: 1 },
    replication: 'session',
  }],
  resources: [{
    kind: 'resource',
    token: { id: 'planar.conformance/intents', version: 1 },
    replication: 'none',
  }],
  commands: [{
    kind: 'command',
    token: { id: 'planar.conformance/move', version: 1 },
  }],
  events: [{
    kind: 'event',
    token: { id: 'planar.conformance/moved', version: 1 },
  }],
  capabilities: [{
    kind: 'capability',
    token: { id: 'planar.conformance/render', version: 1 },
    cardinality: 'one',
  }],
  systems: [{
    id: INTEGRATE,
    after: [],
    before: [],
  }],
} as const satisfies ModContract;

export const conformanceManifest = {
  id: 'planar.conformance.dot',
  version: '1.0.0',
  mods: [{ id: conformanceContract.id, version: conformanceContract.version }],
  seats: [
    { principalId: 'alpha', commands: [MOVE] },
    { principalId: 'bravo', commands: [MOVE] },
  ],
} as const satisfies ModpackManifest;
