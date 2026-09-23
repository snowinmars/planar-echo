import type { Envelope, Snapshot } from '@planar/shared';

import type { World } from './types.js';

export const snapshotWorld = (world: World, seq: number): Omit<Snapshot, 'mods'> => ({
  ...world.meta,
  seq,
  entities: [
    ...world.entities.values(),
  ].map(x => structuredClone<Envelope>(x)),
});
