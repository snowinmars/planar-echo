import type { ModManifest } from '@planar/shared';

export type Result
  = | {
    ok: true;
    data: {
      manifests: ModManifest[];
    };
  }
  | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DIRECTORY_NOT_FOUND'; message: string; status: 404 };
