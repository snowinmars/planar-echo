import { getSkeletonItem, setSkeletonItem } from './crud';

import type { CachedSkeletonItem } from './crud';
import type { Maybe } from '@planar/shared';

const storeName = 'cres';
export const getDbCre = (id: string): Promise<Maybe<CachedSkeletonItem>> => getSkeletonItem(storeName, id);
export const setDbCre = (id: string, skeleton: string): Promise<void> => setSkeletonItem(storeName, id, skeleton);
