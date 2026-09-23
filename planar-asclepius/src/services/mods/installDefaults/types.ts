export type Command = Readonly<{
  modsDir: string;
}>;

export type Result
  = | { ok: true; data: string[] }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'BUILD_FAILED'; message: string; status: 500 };
