export type Command = Readonly<{
  modsDir: string;
}>;

export type Result
  = | { ok: true }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DIRECTORY_NOT_FOUND'; message: string; status: 404 };
