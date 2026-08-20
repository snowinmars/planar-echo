import type { RawIni } from '@/steps/4.biffs2json/pstee/ini/parseInis.types.js';
import { either, nothing, type GhostIni } from '@planar/shared';

export const toGhost = (raw: RawIni): GhostIni => {
  const numberedSections = raw.numberedSections.map((x) => {
    return {
      ...x,
      hitsound: either(x.hitsound, []),
    };
  });
  const sounds = raw.sounds
    ? {
        ...raw.sounds,
        hitsound: either(raw.sounds.hitsound, []),
      }
    : nothing();
  const creatureSections = raw.creatureSections.map((x) => {
    return {
      ...x,
      spawnPoint: either(x.spawnPoint, []),
    };
  });

  return {
    ...raw,
    numberedSections,
    sounds,
    creatureSections,
  };
};
