export type Command = Readonly<{
  dlgId: string;
}>;

export type Result
  = | { ok: true; data: string[] }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'CRE_NOT_FOUND'; message: string; status: 404 };
