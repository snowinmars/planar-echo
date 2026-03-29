import type { GameLanguage } from '@planar/shared';

export type Command = Readonly<{
  dialogueId: string;
  gameLanguage: GameLanguage;
  ghostDir: string;
}>;

export type Result
  = | { ok: true; data: { content: string } }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'FILE_NOT_FOUND'; message: string; status: 404 };
