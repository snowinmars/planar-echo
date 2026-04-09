export type Command = Readonly<{
  ghostPath: string;
}>;

export type Result
  = | { ok: true }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DIRECTORY_NOT_FOUND'; message: string; status: 404 }
    | { code: 'DIRECTORY_NOT_EMPTY'; message: string; status: 406 };
