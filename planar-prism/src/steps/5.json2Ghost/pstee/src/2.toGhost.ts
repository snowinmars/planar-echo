import type { RawSrc } from '@/steps/4.biffs2json/pstee/src/parseSrcs.types.js';
import type { GhostSrc } from '@planar/shared';

export const toGhost = (raw: RawSrc): GhostSrc => ({
  resourceName: raw.resourceName,
  entries: raw.entries.map(entry => ({
    strref: entry.strref,
    weight: entry.weight,
  })),
});
