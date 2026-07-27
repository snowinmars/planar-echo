import { getSkeletonItem, setSkeletonItem } from './crud';

import type { CachedSkeletonItem } from './crud';
import type { Maybe } from '@planar/shared';

const storeName = 'dialogues';
export const getDbDialogue = (id: string): Promise<Maybe<CachedSkeletonItem>> => getSkeletonItem(storeName, id);
export const setDbDialogue = (id: string, skeleton: string): Promise<void> => setSkeletonItem(storeName, id, skeleton);
