import type { FromDaemon, Snapshot } from '@planar/kernel';
import type { Maybe } from '@planar/shared';

export type PlaySocketState = 'connecting' | 'open' | 'closed' | 'error';
export type PlaySessionApi = Readonly<{
  loadArea: (are: string, entrance: Maybe<string>) => void;
  setPaused: (paused: boolean) => void;
  destroy: () => void;
}>;

export type PlayView = Readonly<{
  handleFromDaemon: (fromDaemon: FromDaemon) => Maybe<Snapshot>;
  destroy: () => void;
}>;
