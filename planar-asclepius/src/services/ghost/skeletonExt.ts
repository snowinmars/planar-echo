import type { GhostType } from '@planar/shared';

export const skeletonExt = (type: GhostType): string => (
  type === 'twoda' ? '.2da.js' : `.${type}.js`
);
