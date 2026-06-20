export type Command = Readonly<{
  ghostDir: string;
}>;

export type Result
  = | { ok: true; data: Readonly<{
    ghostDir: string;
  }>; }
  | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DIRECTORY_NOT_FOUND'; message: string; status: 404 };
