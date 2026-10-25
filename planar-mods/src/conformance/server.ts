import {
  INTEGRATE,
  INTENTS,
  MOVE,
  MOVED,
  STEP,
  TRANSFORM,
  WORLD,
} from './contract.js';

import { isRecord, type ServerHost } from '@planar/shared';

type Point = { x: number; y: number };
type Intent = { entityId: number; dx: number; dy: number };

const point = (value: unknown): Point | null => {
  if (!isRecord(value)) return null;
  if (typeof value.x !== 'number' || typeof value.y !== 'number') return null;
  if (!Number.isFinite(value.x) || !Number.isFinite(value.y)) return null;
  return { x: value.x, y: value.y };
};

const axis = (value: unknown): number | null => {
  if (value !== -1 && value !== 0 && value !== 1) return null;
  return value;
};

const clamp = (value: number): number => Math.max(0, Math.min(WORLD, value));

const intentsOf = (value: unknown): Intent[] => {
  if (!isRecord(value) || !Array.isArray(value.moves)) return [];
  return value.moves.flatMap((move) => {
    if (!isRecord(move)) return [];
    if (typeof move.entityId !== 'number') return [];
    const dx = axis(move.dx);
    const dy = axis(move.dy);
    if (dx === null || dy === null) return [];
    return [{ entityId: move.entityId, dx, dy }];
  });
};

export const register = (host: ServerHost): void => {
  host.boot((ctx) => {
    const alpha = ctx.createEntity();
    const bravo = ctx.createEntity();
    ctx.writeProtocol(alpha, TRANSFORM, { x: 48, y: 48 });
    ctx.writeProtocol(bravo, TRANSFORM, { x: 144, y: 48 });
    ctx.bindSeat('alpha', alpha);
    ctx.bindSeat('bravo', bravo);
    ctx.writeResource(INTENTS, { moves: [] });
  });

  host.onCommand(MOVE, (ctx) => {
    const dx = isRecord(ctx.payload) ? axis(ctx.payload.dx) : null;
    const dy = isRecord(ctx.payload) ? axis(ctx.payload.dy) : null;
    if (dx === null || dy === null) throw new Error('move payload must be unit steps');
    const entityId = ctx.entityForPrincipal(ctx.principalId);
    if (entityId === null) throw new Error('principal has no entity');
    const current = intentsOf(ctx.readResource(INTENTS));
    ctx.writeResource(INTENTS, { moves: [...current, { entityId, dx, dy }] });
  });

  host.onSystem(INTEGRATE, (ctx) => {
    const moves = intentsOf(ctx.readResource(INTENTS));
    const moved: number[] = [];
    for (const move of moves) {
      const current = point(ctx.readProtocol(move.entityId, TRANSFORM));
      if (!current) throw new Error(`Entity ${move.entityId} has no transform`);
      ctx.writeProtocol(move.entityId, TRANSFORM, {
        x: clamp(current.x + move.dx * STEP),
        y: clamp(current.y + move.dy * STEP),
      });
      moved.push(move.entityId);
    }
    ctx.writeResource(INTENTS, { moves: [] });
    if (moved.length > 0) ctx.emit(MOVED, { entityIds: moved });
  });

  host.onEvent(MOVED, () => {
    // Read-only observer. Movement is already committed.
  });
};
