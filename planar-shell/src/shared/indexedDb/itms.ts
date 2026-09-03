import { getSkeletonItem, setSkeletonItem } from './crud';

import type { Maybe } from '@planar/shared';

import type { CachedSkeletonItem } from './crud';

const storeName = 'itms';
export const getDbItm = (id: string): Promise<Maybe<CachedSkeletonItem>> => getSkeletonItem(storeName, id);
export const setDbItm = (id: string, skeleton: string): Promise<void> => setSkeletonItem(storeName, id, skeleton);
