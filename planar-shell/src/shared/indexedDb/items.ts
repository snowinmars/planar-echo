import { getSkeletonItem, setSkeletonItem } from './crud';

import type { CachedSkeletonItem } from './crud';
import type { Maybe } from '@planar/shared';

const storeName = 'items';
export const getDbItem = (id: string): Promise<Maybe<CachedSkeletonItem>> => getSkeletonItem(storeName, id);
export const setDbItem = (id: string, skeleton: string): Promise<void> => setSkeletonItem(storeName, id, skeleton);
