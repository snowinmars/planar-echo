import { TICK_HZ } from '@planar/shared';

import { rewriteWalkGrid } from '../cell/math.js';

import type { Envelope, GhostAreWalk } from '@planar/shared';

import type { World } from './types.js';

export const createWorld = (
  areId: string,
  walk: GhostAreWalk,
  walkBase: Uint8Array,
  player: Envelope,
): World => {
  const meta: World['meta'] = {
    tick: 0,
    tickHz: TICK_HZ,
    paused: false,
    nextId: player.id + 1,
    areId,
  };

  const walkGrid = rewriteWalkGrid(walk, walkBase);

  const entities = new Map<number, Envelope>([[
    player.id, player,
  ]]);

  return {
    meta,
    walkBase,
    walkGrid,
    entities,
  };
};
