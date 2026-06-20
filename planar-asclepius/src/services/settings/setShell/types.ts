export type Command = Readonly<{
  shellDir: string;
}>;

export type Result
  = | { ok: true; data: Readonly<{
    shellDir: string;
  }>; }
  | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DIRECTORY_NOT_FOUND'; message: string; status: 404 };
