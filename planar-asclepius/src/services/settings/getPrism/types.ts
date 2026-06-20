export type Result
  = | { ok: true; data: Readonly<{
    prismDir: string;
  }>; };
