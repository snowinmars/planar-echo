import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveModpack } from '@planar/shared';

import { SessionHost } from '../src/host.js';

import type { ModContract, ModpackManifest, ServerHost } from '@planar/shared';

const TRANSFORM = 'planar.conformance/transform@1';
const INTENTS = 'planar.conformance/intents@1';
const MOVE = 'planar.conformance/move@1';
const MOVED = 'planar.conformance/moved@1';
const INTEGRATE = 'planar.conformance/integrate@1';

const contract = {
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
  commands: [{ kind: 'command', token: { id: 'planar.conformance/move', version: 1 } }],
  events: [{ kind: 'event', token: { id: 'planar.conformance/moved', version: 1 } }],
  capabilities: [],
  systems: [{ id: INTEGRATE, after: [], before: [] }],
} as const satisfies ModContract;

const manifest: ModpackManifest = {
  id: 'planar.conformance.dot',
  version: '1.0.0',
  mods: [{ id: contract.id, version: contract.version }],
  seats: [
    { principalId: 'alpha', commands: [MOVE] },
    { principalId: 'bravo', commands: [MOVE] },
  ],
};

const register = (host: ServerHost): void => {
  host.boot((ctx) => {
    const alpha = ctx.createEntity();
    const bravo = ctx.createEntity();
    ctx.writeProtocol(alpha, TRANSFORM, { x: 0, y: 0 });
    ctx.writeProtocol(bravo, TRANSFORM, { x: 20, y: 0 });
    ctx.bindSeat('alpha', alpha);
    ctx.bindSeat('bravo', bravo);
    ctx.writeResource(INTENTS, { moves: [] });
  });
  host.onCommand(MOVE, (ctx) => {
    const payload = ctx.payload as { dx?: number; dy?: number };
    if (payload.dx !== 1 && payload.dx !== -1 && payload.dx !== 0) throw new Error('bad dx');
    if (payload.dy !== 1 && payload.dy !== -1 && payload.dy !== 0) throw new Error('bad dy');
    const entityId = ctx.entityForPrincipal(ctx.principalId);
    if (entityId === null) throw new Error('no entity');
    const current = ctx.readResource(INTENTS) as { moves: unknown[] };
    ctx.writeResource(INTENTS, {
      moves: [...current.moves, { entityId, dx: payload.dx, dy: payload.dy }],
    });
  });
  host.onSystem(INTEGRATE, (ctx) => {
    const current = ctx.readResource(INTENTS) as { moves: { entityId: number; dx: number; dy: number }[] };
    const moved: number[] = [];
    for (const move of current.moves) {
      const point = ctx.readProtocol(move.entityId, TRANSFORM) as { x: number; y: number };
      ctx.writeProtocol(move.entityId, TRANSFORM, { x: point.x + move.dx, y: point.y + move.dy });
      moved.push(move.entityId);
    }
    ctx.writeResource(INTENTS, { moves: [] });
    if (moved.length > 0) ctx.emit(MOVED, { entityIds: moved });
  });
  host.onEvent(MOVED, () => undefined);
};

void test('two principals see both dots and cannot use a foreign epoch', () => {
  const lock = resolveModpack({ manifest, contracts: [contract] });
  const host = new SessionHost('session-test', lock);
  host.registerInline(register);
  const alpha = host.join('c-alpha', 'alpha', lock.lockHash);
  const bravo = host.join('c-bravo', 'bravo', lock.lockHash);
  assert.equal(alpha.ok, true);
  assert.equal(bravo.ok, true);
  if (!alpha.ok || !bravo.ok) return;
  assert.notEqual(alpha.frame.ownedEntityId, bravo.frame.ownedEntityId);
  assert.equal(alpha.frame.rows.length, 2);
  assert.equal(host.join('c-alpha-2', 'alpha', lock.lockHash).ok, false);
  assert.equal(host.join('c-stranger', 'stranger', lock.lockHash).ok, false);
  assert.match(host.join('c-bad', 'bravo', 'deadbeef').ok ? '' : 'lock mismatch', /lock mismatch/);

  assert.equal(host.admit('c-alpha', alpha.frame.rows[0] ? lock.commands[0]?.wireId ?? 0 : 0, 99, { dx: 1, dy: 0 }), 'stale connection epoch');
  const moveWire = lock.commands[0]?.wireId ?? 0;
  assert.equal(host.admit('c-alpha', moveWire, alpha.frame.connectionEpoch, { dx: 1, dy: 0 }), null);
  const frame = host.tick();
  assert.equal(frame.type, 'replication');
  if (frame.type !== 'replication') return;
  const own = frame.rows.find(row => row.entityId === alpha.frame.ownedEntityId);
  assert.deepEqual(own?.value, { x: 1, y: 0 });
  const projected = host.project(frame);
  assert.equal(projected.length, 2);
  assert.equal(projected[0]?.frame.type === 'replication' ? projected[0].frame.rows.length : 0, 2);
});
