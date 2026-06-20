export type Result
  = | { ok: true; data: Readonly<{
    shellDir: string;
  }>; };
