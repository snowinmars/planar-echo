export type Command = Readonly<{
  creId: string;
}>;

export type Result
  = | { ok: true; data: string[] }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DLGS_NOT_FOUND'; message: string; status: 404 };
