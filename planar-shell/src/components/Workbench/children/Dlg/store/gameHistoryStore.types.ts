import type {
  GameHistoryEvent,
  GameHistoryPage,
} from '@/shared/indexedDb';

import type { DisposeFunction } from './helpers';

export type GameHistoryStore = GameHistoryPage & Readonly<{
  loading: boolean;
  revision: number;
  append: (events: GameHistoryEvent[]) => Promise<void>;
  activateView: () => Promise<void>;
  loadNewest: () => Promise<void>;
  loadOlder: () => Promise<void>;
  loadNewer: () => Promise<void>;
  start: () => DisposeFunction;
}>;
