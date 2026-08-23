import type { Raw2da } from '@/steps/4.biffs2json/pstee/2da/parse2das.types.js';
import type { GhostTwoda } from '@planar/shared';

export const toGhost = (raw: Raw2da): GhostTwoda => ({
  resourceName: raw.resourceName,
  encrypted: raw.encrypted,
  signature: raw.signature,
  defaultValue: raw.defaultValue,
  columns: raw.columns,
  rows: raw.rows.map(row => ({
    name: row.name,
    cells: row.cells,
  })),
});
