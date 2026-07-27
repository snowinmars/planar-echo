import { getSkeletonItem, setSkeletonItem } from './crud';

import type { CachedSkeletonItem } from './crud';
import type { Maybe } from '@planar/shared';

const storeName = 'creatures';
export const getDbCreature = (id: string): Promise<Maybe<CachedSkeletonItem>> => getSkeletonItem(storeName, id);
export const setDbCreature = (id: string, skeleton: string): Promise<void> => setSkeletonItem(storeName, id, skeleton);
