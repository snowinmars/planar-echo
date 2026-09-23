export type Command = Readonly<{
  path: string;
  modsRuntimeDir: string;
}>;

export type Result
  = | { ok: true; data: { fullPath: string } }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'FILE_NOT_FOUND'; message: string; status: 404 }
    | { code: 'FORBIDDEN_FILE'; message: string; status: 403 }
    | { code: 'DIRECTORY_TRAVERSE'; message: string; status: 403 };
