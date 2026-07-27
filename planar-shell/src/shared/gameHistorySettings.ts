import { nothing } from '@planar/shared';
import planarLocalStorage from './planarLocalStorage';

import type { Maybe } from '@planar/shared';

export const gameHistorySettingsKeys = {
  pageSize: 'gameHistory_pageSize',
  browsedPages: 'gameHistory_browsedPages',
  storedPages: 'gameHistory_storedPages',
} as const;

export const initialGameHistorySettings: GameHistorySettings = {
  pageSize: 25,
  browsedPages: 3,
  storedPages: nothing(),
};

export type GameHistorySettings = Readonly<{
  pageSize: number;
  browsedPages: number;
  storedPages: Maybe<number>;
}>;

export const getGameHistoryPageSize = () => planarLocalStorage.get<number>(gameHistorySettingsKeys.pageSize, initialGameHistorySettings.pageSize)!;
export const getGameHistoryBrowsedPages = () => planarLocalStorage.get<number>(gameHistorySettingsKeys.browsedPages, initialGameHistorySettings.browsedPages)!;
export const getGameHistoryStoredPages = () => planarLocalStorage.get<Maybe<number>>(gameHistorySettingsKeys.storedPages, initialGameHistorySettings.storedPages);
