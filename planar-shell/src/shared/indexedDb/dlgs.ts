import { getSkeletonItem, setSkeletonItem } from './crud';

import type { Maybe } from '@planar/shared';

import type { CachedSkeletonItem } from './crud';

const storeName = 'dlgs';
export const getDbDlg = (id: string): Promise<Maybe<CachedSkeletonItem>> => getSkeletonItem(storeName, id);
export const setDbDlg = (id: string, skeleton: string): Promise<void> => setSkeletonItem(storeName, id, skeleton);
