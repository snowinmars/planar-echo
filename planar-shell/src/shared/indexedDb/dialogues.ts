import { getTranslatedSkeletonItem, setTranslatedSkeletonItem } from './crud';

import type { CachedTranslatedSkeletonItem } from './crud';
import type { Maybe } from '@planar/shared';

const storeName = 'dialogues';
export const getDbDialogue = (id: string): Promise<Maybe<CachedTranslatedSkeletonItem>> => getTranslatedSkeletonItem(storeName, id);
export const setDbDialogue = (id: string, skeleton: string, translation: string): Promise<void> => setTranslatedSkeletonItem(storeName, id, skeleton, translation);
