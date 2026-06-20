export type Result
  = | { ok: true; data: Readonly<{
    ghostDir: string;
  }>; };
