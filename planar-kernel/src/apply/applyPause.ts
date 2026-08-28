import type { ApplyResult, InputCommand, World } from '../types.js';

export const applyPause = (world: World, command: Extract<InputCommand, { type: 'session/pause' }>): ApplyResult => {
  world.meta = {
    ...world.meta,
    paused: command.paused,
  };

  return {
    events: [{
      table: 'meta',
      op: 'upsert',
      row: {
        tickHz: world.meta.tickHz,
        paused: world.meta.paused,
        nextId: world.meta.nextId,
        areId: world.meta.areId,
        canCloseDoors: world.meta.canCloseDoors,
      },
    }],
  };
};
