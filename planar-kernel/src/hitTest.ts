import type { GhostAreDoor } from '@planar/shared';
import type { Point } from './types.js';

export const pointInPoly = (point: Point, poly: Point[]): boolean => {
  if (poly.length < 3) return false;

  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const a = poly[i];
    const b = poly[j];

    if (!a || !b) continue;

    const crosses = (a.y > point.y) !== (b.y > point.y);
    if (!crosses) continue;

    const dy = b.y - a.y;
    if (dy === 0) continue;

    const xAt = ((b.x - a.x) * (point.y - a.y)) / dy + a.x;
    if (point.x < xAt) inside = !inside;
  }

  return inside;
};

export const doorPoly = (door: GhostAreDoor, open: boolean): Point[] => (
  open ? door.openedGeometry.vertices : door.closedGeometry.vertices
);

export const hitDoor = (
  doors: Iterable<GhostAreDoor>,
  doorOpen: ReadonlyMap<string, boolean>,
  point: Point,
): GhostAreDoor | undefined => {
  for (const door of doors) {
    const id = door.doorId.trim();
    const open = doorOpen.get(id) ?? false;
    const poly = doorPoly(door, open);

    if (pointInPoly(point, poly)) return door;
  }
  return undefined;
};

export const closerPoint = (from: Point, a: Point, b: Point): Point => {
  const da = (from.x - a.x) ** 2 + (from.y - a.y) ** 2;
  const db = (from.x - b.x) ** 2 + (from.y - b.y) ** 2;
  return da <= db ? a : b;
};

export const worldDist = (a: Point, b: Point): number => (
  Math.hypot(a.x - b.x, a.y - b.y)
);
