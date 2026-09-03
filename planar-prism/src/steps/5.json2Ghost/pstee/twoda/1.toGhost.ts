import type { GhostTwoda } from '@planar/shared';

import type { RawTwoda } from '@/steps/4.biffs2json/pstee/2da/parse2das.types.js';

export const toGhost = (raw: RawTwoda): GhostTwoda => ({
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
