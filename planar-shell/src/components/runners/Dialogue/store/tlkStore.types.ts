const _sourceId = [
  'current-dialogue',
  'game-history',
] as const;
export const sourceId = {
  dialogue: _sourceId[0],
  gameHistory: _sourceId[1],
} as const;
export type SourceId = typeof _sourceId[number];

export const emptyTlkSource: TlkSource = {
  tlkRefs: [],
  lines: new Map(),
  loading: false,
  revision: 0,
};

export type TlkSource = Readonly<{
  tlkRefs: number[];
  lines: Map<number, string>;
  loading: boolean;
  revision: number;
}>;

export type LoadTlkRefsProps = Readonly<{
  tlkRefs: number[];
  sourceId: SourceId;
}>;

export type TlkStore = Readonly<{
  sources: Map<SourceId, TlkSource>;
  loadTlkRefs: (props: LoadTlkRefsProps) => Promise<void>;
  release: (sourceId: SourceId) => void;
  start: () => () => void;
}>;
