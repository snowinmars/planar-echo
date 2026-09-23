import { nothing, PLAYER_ACTOR_ID } from '@planar/shared';

import type { Envelope, Maybe, WorldEffect } from '@planar/shared';

import type { HostSession } from './createServerHost.js';

export type AreaLoad = Readonly<{
  are: string;
  entrance: Maybe<string>;
}>;

const metaUpsert = (session: HostSession) => ({
  type: 'meta/upsert' as const,
  row: {
    tickHz: session.world.meta.tickHz,
    paused: session.world.meta.paused,
    nextId: session.world.meta.nextId,
    areId: session.world.meta.areId,
  },
});

/**
 * Sole World writer for mod hooks. Returns AreaLoad when the current phase must stop.
 */
export const applyEffects = (
  session: HostSession,
  modId: string,
  effects: WorldEffect[],
): Maybe<AreaLoad> => {
  for (const effect of effects) {
    switch (effect.type) {
      case 'spawn': {
        const id = session.world.meta.nextId;
        const reservedPlayerId = id === PLAYER_ACTOR_ID;
        if (reservedPlayerId) {
          throw new Error('spawn id=1 is reserved');
        }
        const row: Envelope = { ...effect.row, id };
        session.world.entities.set(id, row);
        session.world.meta = { ...session.world.meta, nextId: id + 1 };
        session.pending.push(
          { type: 'entity/upsert', id, row },
          metaUpsert(session),
        );
        break;
      }
      case 'despawn': {
        const despawnPlayer = effect.id === PLAYER_ACTOR_ID;
        if (despawnPlayer) throw new Error('cannot despawn player');
        session.world.entities.delete(effect.id);
        session.pending.push({ type: 'entity/remove', id: effect.id });
        break;
      }
      case 'entityPatch': {
        const prev = session.world.entities.get(effect.id);
        if (!prev) break;
        const row: Envelope = {
          ...prev,
          ...effect.patch,
          pos: effect.patch.pos ? { x: effect.patch.pos.x, y: effect.patch.pos.y } : prev.pos,
        };
        session.world.entities.set(effect.id, row);
        session.pending.push({ type: 'entity/upsert', id: effect.id, row });
        break;
      }
      case 'publish': {
        session.published.set(modId, effect.row);
        session.pending.push({ type: 'mod/upsert', modId, row: effect.row });
        break;
      }
      case 'loadArea': {
        const paused = session.world.meta.paused;
        if (paused) {
          throw new Error('loadArea rejected: paused');
        }
        return {
          are: effect.are,
          entrance: effect.entrance,
        };
      }
      case 'enqueueCommand': {
        session.emitQueue.push(effect.command);
        break;
      }
      default: {
        const _never: never = effect;
        throw new Error(`unknown WorldEffect: ${JSON.stringify(_never)}`);
      }
    }
  }
  return nothing();
};
