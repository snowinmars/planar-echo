export type Command = Readonly<{
  dir: string;
}>;

export type Result
  = | { ok: true }
    | { ok: false; error: OpenDirError };

export type OpenDirError
  = | { code: 'DIRECTORY_NOT_FOUND'; message: string; status: 404 }
    | { code: 'NOT_A_DIRECTORY'; message: string; status: 400 }
    | { code: 'OPEN_FAILED'; message: string; status: 500 };
