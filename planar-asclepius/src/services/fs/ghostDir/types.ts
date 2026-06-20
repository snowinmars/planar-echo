export type Command = Readonly<{
  path: string;
}>;

export type Result
  = | { ok: true; data: Readonly<{
    fullPath: string;
  }>; }
  | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'FILE_NOT_FOUND'; message: string; status: 404 }
    | { code: 'DIRECTORY_TRAVERSE'; message: string; status: 403 };
