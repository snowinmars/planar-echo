/*
 * Orientation mapping adapted from GemRB (GPL-2.0-or-later).
 * planar-echo changes are GPL-3.0-or-later.
 * See THIRD_PARTY_NOTICES.md for source and license details.
 */

import type { Direction } from './direction.js';
import type { Point } from './geometry.js';

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

export const bamCycleIndexForFacingCycle = (facing: number, facingCycle: 'five' | 'nine'): number => {
  const face = facing & 15;
  return facingCycle === 'five' ? SIXTEEN_TO_FIVE[face]! : SIXTEEN_TO_NINE[face]!;
};

// Srly? Srly.
export const pstBamCandidates = (resref: string): string[] => [`${resref.replace('.bam', '')}b.bam`, resref];

export const facingFromDirection = (direction: Direction): number => {
  const n = Number.parseInt(direction, 10);
  if (!Number.isFinite(n)) throw new Error(`Cannot parse facing from direction '${direction}'`);
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

export const bamEastMirror = (facing: number): boolean => (facing & 15) > 8;
