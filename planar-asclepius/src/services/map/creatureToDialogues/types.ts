export type Command = Readonly<{
  creatureId: string;
}>;

export type Result
  = | { ok: true; data: string[] }
    | { ok: false; error: ValidationError };

export type ValidationError
  = | { code: 'DIALOGUES_NOT_FOUND'; message: string; status: 404 };
