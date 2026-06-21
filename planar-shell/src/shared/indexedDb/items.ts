import { getItem, setItem } from './crud';

import type { CachedTranslatedSkeletonItem } from './crud';
import type { Maybe } from '@planar/shared';

const storeName = 'items';
export const getDbItem = (id: string): Promise<Maybe<CachedTranslatedSkeletonItem>> => getItem(storeName, id);
export const setDbItem = (id: string, skeleton: string, translation: string): Promise<void> => setItem(storeName, id, skeleton, translation);
