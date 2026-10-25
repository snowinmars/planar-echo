import assert from 'node:assert/strict';
import test from 'node:test';

import { SessionKernel } from '@planar/kernel';
import { resolveModpack } from '@planar/shared';

import type { ModContract, ModpackManifest } from '@planar/shared';

const TRANSFORM = 'planar.test/transform@1';
const INTENTS = 'planar.test/intents@1';
const MOVE = 'planar.test/move@1';

const contract = {
  id: 'planar.test.dot',
  version: '1.0.0',
  protocols: [{
    kind: 'protocol',
    token: { id: 'planar.test/transform', version: 1 },
    replicateTo: 'session',
  }],
  resources: [{
    kind: 'resource',
    token: { id: 'planar.test/intents', version: 1 },
    replicateTo: 'none',
  }],
  commands: [{
    kind: 'command',
    token: { id: 'planar.test/move', version: 1 },
  }],
  events: [],
  capabilities: [],
  systems: [{ id: 'planar.test/integrate@1', after: [], before: [] }],
} as const satisfies ModContract;

const manifest: ModpackManifest = {
  id: 'planar.test.dot',
  version: '1.0.0',
  mods: [{ id: contract.id, version: contract.version }],
  seats: [
    { principalId: 'alpha', commands: [MOVE] },
    { principalId: 'bravo', commands: [MOVE] },
  ],
};

void test('resolver rejects a systems cycle and freezes token keys', () => {
  assert.throws(() => resolveModpack({
    manifest,
    contracts: [{
      ...contract,
      systems: [
        { id: 'a', after: ['b'], before: [] },
        { id: 'b', after: ['a'], before: [] },
      ],
    }],
  }), /cycle/);

  const lock = resolveModpack({ manifest, contracts: [contract] });
  assert.equal(lock.protocols[0]?.key, TRANSFORM);
  assert.equal(lock.lockHash, resolveModpack({ manifest, contracts: [contract] }).lockHash);
});

void test('two seats move only their own entities and hash the same checkpoint', () => {
  const lock = resolveModpack({ manifest, contracts: [contract] });
  const boot = (kernel: SessionKernel): void => {
    kernel.transact(() => {
      const alpha = kernel.createEntity();
      const bravo = kernel.createEntity();
      kernel.writeProtocol(alpha, TRANSFORM, { x: 0, y: 0 });
      kernel.writeProtocol(bravo, TRANSFORM, { x: 10, y: 0 });
      kernel.bindSeat('alpha', alpha);
      kernel.bindSeat('bravo', bravo);
      kernel.writeResource(INTENTS, { moves: [] });
    });
    kernel.registerCommand(MOVE, (input) => {
      const payload = input.payload as { dx: number };
      const entityId = input.principalId === 'alpha' ? 1 : 2;
      const current = input.readResource(INTENTS) as { moves: { entityId: number; dx: number }[] };
      input.writeResource(INTENTS, { moves: [...current.moves, { entityId, dx: payload.dx }] });
    });
    kernel.registerSystem('planar.test/integrate@1', (input) => {
      const current = input.readResource(INTENTS) as { moves: { entityId: number; dx: number }[] };
      for (const move of current.moves) {
        const point = input.readProtocol(move.entityId, TRANSFORM) as { x: number; y: number };
        input.writeProtocol(move.entityId, TRANSFORM, { x: point.x + move.dx, y: point.y });
      }
      input.writeResource(INTENTS, { moves: [] });
    });
  };

  const run = (): string => {
    const kernel = new SessionKernel(lock);
    boot(kernel);
    const first = kernel.runTick([{ commandId: MOVE, principalId: 'alpha', payload: { dx: 3 } }]);
    const second = kernel.runTick([{ commandId: MOVE, principalId: 'bravo', payload: { dx: -2 } }]);
    const alpha = second.rows.find(row => row.entityId === 1);
    const bravo = second.rows.find(row => row.entityId === 2);
    assert.deepEqual(alpha?.value, { x: 3, y: 0 });
    assert.deepEqual(bravo?.value, { x: 8, y: 0 });
    assert.equal(first.tick, 1);
    return second.checkpoint;
  };

  assert.equal(run(), run());
});

void test('a failed command does not commit', () => {
  const lock = resolveModpack({ manifest, contracts: [contract] });
  const kernel = new SessionKernel(lock);
  kernel.transact(() => {
    const alpha = kernel.createEntity();
    kernel.writeProtocol(alpha, TRANSFORM, { x: 1, y: 1 });
    kernel.bindSeat('alpha', alpha);
    kernel.bindSeat('bravo', kernel.createEntity());
  });
  kernel.registerCommand(MOVE, () => {
    throw new Error('nope');
  });
  kernel.registerSystem('planar.test/integrate@1', () => undefined);
  const result = kernel.runTick([{ commandId: MOVE, principalId: 'alpha', payload: {} }]);
  assert.equal(result.rejected.length, 1);
  assert.deepEqual(result.rows[0]?.value, { x: 1, y: 1 });
});
