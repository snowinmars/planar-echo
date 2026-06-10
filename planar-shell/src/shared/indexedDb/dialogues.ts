import { getItem, setItem } from './crud';

import type { CachedTranslatedSkeletonItem } from './crud';
import type { Maybe } from '@planar/shared';

const storeName = 'dialogues';
export const getDbDialogue = (id: string): Promise<Maybe<CachedTranslatedSkeletonItem>> => getItem(storeName, id);
export const setDbDialogue = (id: string, skeleton: string, translation: string): Promise<void> => setItem(storeName, id, skeleton, translation);
