import type { Patch } from '@planar/shared';

export type Ipc = {
  nextSeq: () => number;
  emitTick: () => void;
  emitPatches: (patches: Patch[]) => void;
  emitSnapshot: () => void;
  flushPending: () => Patch[];
};
