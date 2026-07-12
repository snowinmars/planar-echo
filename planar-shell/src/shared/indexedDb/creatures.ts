import { getTranslatedSkeletonItem, setTranslatedSkeletonItem } from './crud';

import type { CachedTranslatedSkeletonItem } from './crud';
import type { Maybe } from '@planar/shared';

const storeName = 'creatures';
export const getDbCreature = (id: string): Promise<Maybe<CachedTranslatedSkeletonItem>> => getTranslatedSkeletonItem(storeName, id);
export const setDbCreature = (id: string, skeleton: string, translation: string): Promise<void> => setTranslatedSkeletonItem(storeName, id, skeleton, translation);
