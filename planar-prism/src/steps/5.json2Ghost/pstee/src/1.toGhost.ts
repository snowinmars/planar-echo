import type { GhostSrc } from '@planar/shared';

import type { RawSrc } from '@/steps/4.biffs2json/pstee/src/parseSrcs.types.js';

export const toGhost = (raw: RawSrc): GhostSrc => ({
  resourceName: raw.resourceName,
  entries: raw.entries.map(entry => ({
    strref: entry.strref,
    weight: entry.weight,
  })),
});
