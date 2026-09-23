import type { ActiveJsonMods } from '@planar/shared';

export type Result
  = | { ok: true; data: ActiveJsonMods }
    | { ok: false; error: { code: 'NOT_FOUND'; message: string; status: 404 } };
