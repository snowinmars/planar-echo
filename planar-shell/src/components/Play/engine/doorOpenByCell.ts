import type { DoorView } from '@planar/kernel';
import type { GhostWedDoor } from '@planar/shared';

export const doorOpenByCell = (
  overlayWidth: number,
  overlayHeight: number,
  doors: GhostWedDoor[],
  snapshotDoors: DoorView[],
): Map<number, boolean> => {
  const out = new Map<number, boolean>();
  const openById = new Map(snapshotDoors.map(door => [door.id, door.open]));

  const cellCount = overlayWidth * overlayHeight;
  for (const door of doors) {
    const id = door.name;
    const open = openById.get(id);

    const doorUnknown = open === undefined;
    if (doorUnknown) throw new Error(`Got unknown door '${id}'`);

    for (const cell of door.doorTileCells) {
      const cellOutOfRange = cell < 0 || cell >= cellCount;
      if (cellOutOfRange) throw new Error(`Cell for door '${id}' is out of range ('0', '${cellCount}')`);
      out.set(cell, open);
    }
  }

  return out;
};
