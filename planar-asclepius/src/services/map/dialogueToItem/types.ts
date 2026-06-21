export type Command = Readonly<{
  dialogueId: string;
}>;

export type Result
  = | { ok: true; data: string[] }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'ITEM_NOT_FOUND'; message: string; status: 404 };
