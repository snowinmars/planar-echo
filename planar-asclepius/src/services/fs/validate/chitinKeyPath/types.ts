export type Command = Readonly<{
  weiduExePath: string;
  chitinKeyPath: string;
  lang: 'ru' | 'en';
}>;

export type Result
  = | { ok: true; data: { biffsCount: number } }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'FILE_NOT_FOUND'; message: string; status: 404 }
    | { code: 'NO_BIFFS'; message: string; status: 404 };
