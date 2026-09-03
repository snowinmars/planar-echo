import { isNothing, nothing } from './maybe.js';

import type { Direction } from './direction.js';
import type { Point } from './geometry.js';
import type { GhostIni } from './ghost/ini.types.js';
import type { Maybe } from './maybe.js';

export type PstAnimStance = 'walk' | 'stand' | 'run';

export const CRE_ANIM_FPS = 15;

// https://github.com/gemrb/gemrb/blob/master/gemrb/core/Orientation.h
/*
  WEST PART       |       EAST PART
                  |
       NW   NNW   N   NNE  NE
  NW   006  007  008  009  010  NE
  WNW  005        |        011  ENE
  W    004       xxx       012  E
  WSW  003        |        013  ESE
  SW   002  001  000  015  014  SE
       SW   SSW   S   SSE  SE
                  |
                  |
 */

const ORIENT_S = 0;
const ORIENT_N = 8;
const ORIENT_E = 12;

// IE facing is 16 dirs (S=0). BAM stores fewer unique views (west + S/N);
// east (facing > 8) reuses the west cycle and is mirrored in bamEastMirror.
// Walk/run BAMs: 9 cycles. Stand BAMs: 5 cycles (~45° each).
const SIXTEEN_TO_NINE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1] as const;
const SIXTEEN_TO_FIVE = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1] as const;

export const animationIdToIniId = (animationId: number): string => (
  `${(animationId & 0xffff).toString(16).padStart(4, '0')}.ini`
);

export const pstStanceFromMotion = (
  pathLength: number,
  speedPxPerTick: number,
  runMinPxPerTick: number,
): PstAnimStance => {
  if (pathLength <= 0) return 'stand';
  return speedPxPerTick >= runMinPxPerTick ? 'run' : 'walk';
};

export const pstSlotResref = (ini: GhostIni, stance: PstAnimStance): Maybe<string> => {
  const slots = ini.monsterPlanescape;
  if (isNothing(slots)) return nothing();

  if (stance === 'run') {
    const run = slots.run;
    if (!isNothing(run) && run !== '') return run;
  }

  if (stance === 'walk' || stance === 'run') {
    const walk = slots.walk;
    if (isNothing(walk) || walk === '') return nothing();
    return walk;
  }

  const stand = slots.stand;
  if (!isNothing(stand) && stand !== '') return stand;

  const combat = slots.stance;
  if (isNothing(combat) || combat === '') return nothing();
  return combat;
};

export const pstBamCandidates = (resref: string): string[] => {
  const id = resref.toLowerCase();
  return [`${id}b`, id];
};

export const facingFromDirection = (direction: Direction): number => {
  const n = Number.parseInt(direction, 10);
  if (!Number.isFinite(n)) return ORIENT_S;
  return n & 15;
};

export const orientFromDelta = (from: Point, to: Point): number => {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  if (deltaX === 0) return deltaY >= 0 ? ORIENT_S : ORIENT_N;

  const angle = Math.atan2(-deltaY, deltaX);
  const pi8 = Math.PI / 8;
  const twoPi = Math.PI * 2;
  const segment = (angle + pi8 / 2 + twoPi) % twoPi;
  const step = Math.floor(segment / pi8);
  return (ORIENT_E - step) & 15;
};

export const bamCycleIndex = (facing: number, stance: PstAnimStance): number => {
  const face = facing & 15;
  return stance === 'stand' ? SIXTEEN_TO_FIVE[face]! : SIXTEEN_TO_NINE[face]!;
};

export const bamEastMirror = (facing: number): boolean => (facing & 15) > 8;
