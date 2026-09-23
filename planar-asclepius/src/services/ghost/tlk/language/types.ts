import type { GameLanguage } from '@planar/shared';

export type Command = Readonly<{
  tlkRefs: number[];
  gameLanguage: GameLanguage;
  ghostDir: string;
}>;

export type TlkItem = Readonly<{ ref: number; line: string }>;

export type Result
  = | { ok: true; data: { content: TlkItem[] } }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'FILE_NOT_FOUND'; message: string; status: 404 }
    | { code: 'TLK_NOT_FOUND'; message: string; status: 404 }
    | { code: 'TLK_REF_NOT_FOUND'; message: string; status: 404 };
