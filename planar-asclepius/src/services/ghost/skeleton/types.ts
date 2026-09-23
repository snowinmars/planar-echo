import type { GhostType } from '@planar/shared';

export type Command = Readonly<{
  ghostDir: string;
  resourceType: GhostType;
  resourceName: string;
}>;

export type Result
  = | { ok: true; data: { content: string } }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'FILE_NOT_FOUND'; message: string; status: 404 };
