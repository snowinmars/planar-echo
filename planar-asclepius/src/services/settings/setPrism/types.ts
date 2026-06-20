export type Command = Readonly<{
  prismDir: string;
}>;

export type Result
  = | { ok: true; data: Readonly<{
    prismDir: string;
  }>; }
  | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DIRECTORY_NOT_FOUND'; message: string; status: 404 };
