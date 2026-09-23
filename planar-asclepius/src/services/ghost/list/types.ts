import type { GhostType, Maybe } from '@planar/shared';

export type Command = Readonly<{
  ghostDir: string;
  resourceType: GhostType;
  partialName?: Maybe<string>;
}>;

export type Result
  = | { ok: true; data: string[] }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DIRECTORY_NOT_FOUND'; message: string; status: 404 };
