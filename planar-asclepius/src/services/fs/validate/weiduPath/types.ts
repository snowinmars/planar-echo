export type Command = Readonly<{
  weiduExePath: string;
}>;

export type Result
  = | { ok: true; data: { version: string } }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'FILE_NOT_FOUND'; message: string; status: 404 }
    | { code: 'WEIDU_ERROR'; message: string; status: 400 };
