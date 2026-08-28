import type { GhostType } from '@planar/shared';

export type GhostSearchHit = Readonly<{
  type: GhostType;
  id: string;
}>;

export type Command = Readonly<{
  ghostDir: string;
  partialName: string;
}>;

export type Result
  = | { ok: true; data: GhostSearchHit[] }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DIRECTORY_NOT_FOUND'; message: string; status: 404 };
