import type { Maybe, WhoId, ItemId } from '@planar/shared';

type GameHistoryTextEvent = Readonly<{
  tlkRef: Maybe<number>;
  whoId: WhoId | ItemId;
  source: string;
}>;

export type GameHistorySayEvent = GameHistoryTextEvent & Readonly<{
  kind: 'say';
}>;

export type GameHistoryResponseEvent = GameHistoryTextEvent & Readonly<{
  kind: 'response';
}>;

export type GameHistoryEvent = GameHistorySayEvent | GameHistoryResponseEvent;
export type GameHistoryKind = GameHistoryEvent['kind'];

export type GameHistoryEntry = GameHistoryEvent & Readonly<{
  sequenceId: number;
  timestamp: number;
}>;

export type GameHistoryPage = Readonly<{
  entries: GameHistoryEntry[];
  hasOlder: boolean;
  hasNewer: boolean;
}>;

export type GameHistoryChange
  = | Readonly<{
    type: 'append';
    entries: GameHistoryEntry[];
  }>
  | Readonly<{
    type: 'replaceWindow';
    page: GameHistoryPage;
  }>
;

// this setting is in indexedDb instead of localStorage
// because this is the only way to prevent race
export const historyRetentionPolicyStoreId = 'historyRetentionPolicyStore' as const;
export type HistoryRetentionPolicy = Readonly<{
  id: typeof historyRetentionPolicyStoreId;
  storedPages: Maybe<number>;
}>;

export type GetGameHistoryPageProps = Readonly<{
  limit: number;
  beforeSequenceId?: Maybe<number>;
  afterSequenceId?: Maybe<number>;
}>;
