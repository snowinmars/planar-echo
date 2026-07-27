import type { DisposeFunction } from './helpers';

export type TlkStore = Readonly<{
  lines: ReadonlyMap<number, string>;

  loading: boolean;
  loadTlkRefs: (tlkRefs: number[]) => Promise<void>;

  getLine: (ref: number) => string | undefined;
  touchRefs: (refs: number[]) => void;
  start: () => DisposeFunction;
}>;
