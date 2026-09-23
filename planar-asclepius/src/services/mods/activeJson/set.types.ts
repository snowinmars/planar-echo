import type { ActiveJsonMods } from '@planar/shared';

export type Result
  = | { ok: true }
    | { ok: false; errors: string[] };
