import type { Envelope, Patch, Snapshot } from '@planar/shared';

const upsertMod = (snapshot: Snapshot, modId: string, row: unknown): Snapshot => ({
  ...snapshot,
  mods: {
    ...snapshot.mods,
    [modId]: row,
  },
});

const upsertEntity = (snapshot: Snapshot, row: Envelope): Snapshot => ({
  ...snapshot,
  entities: [
    ...snapshot.entities.filter(entity => entity.id !== row.id),
    structuredClone<Envelope>(row),
  ],
});

const removeEntity = (snapshot: Snapshot, id: number): Snapshot => ({
  ...snapshot,
  entities: snapshot.entities.filter(entity => entity.id !== id),
});

/**
 * Apply patches onto a snapshot (client catches up without simulating).
 */
export const foldPatches = (snapshot: Snapshot, patches: Patch[]): Snapshot => {
  let next = snapshot;

  for (const patch of patches) {
    const patchType = patch.type;
    switch (patchType) {
      case 'entity/upsert': {
        next = upsertEntity(next, patch.row);
        break;
      }

      case 'entity/remove': {
        next = removeEntity(next, patch.id);
        break;
      }

      case 'meta/upsert': {
        next = {
          ...next,
          tickHz: patch.row.tickHz,
          paused: patch.row.paused,
          nextId: patch.row.nextId,
          areId: patch.row.areId,
        };
        break;
      }

      case 'mod/upsert': {
        next = upsertMod(next, patch.modId, patch.row);
        break;
      }

      case 'command/rejected': break;

      default: throw new Error(`Patch type is out of range: '${patchType}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  }

  return next;
};
