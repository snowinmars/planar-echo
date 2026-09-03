import { Assets, Texture } from 'pixi.js';
import {
  animationIdToIniId,
  isNothing,
  nothing,
  pstBamCandidates,
  pstSlotResref,
} from '@planar/shared';
import { assetUrl } from '@/shared/assetUrl';
import { loadGhostBam } from '@/components/Workbench/children/Bam/store/bamApi';
import { loadGhostCre } from '@/components/Workbench/children/Cre/store/creApi';
import { loadGhostIni } from '@/components/Workbench/children/Ini/store/iniApi';

import type { GhostBam, GhostIni, Maybe, PstAnimStance } from '@planar/shared';

export type LoadedBam = {
  bam: GhostBam;
  atlas: Texture;
  textures: Map<number, Texture>;
};

export type CreAnimSet = Readonly<{
  walk: Maybe<LoadedBam>;
  stand: Maybe<LoadedBam>;
  run: Maybe<LoadedBam>;
}>;

export type CreArtCache = {
  bam: Map<string, LoadedBam>;
  cre: Map<string, CreAnimSet>;
  inflight: Map<string, Promise<CreAnimSet>>;
};

export const createCreArtCache = (): CreArtCache => ({
  bam: new Map(),
  cre: new Map(),
  inflight: new Map(),
});

const loadBamByResref = async (
  cache: CreArtCache,
  resref: string,
  serverUrl: string,
  ghostDir: string,
): Promise<Maybe<LoadedBam>> => {
  for (const candidate of pstBamCandidates(resref)) {
    const bamId = `${candidate}.bam`;
    const hit = cache.bam.get(bamId);
    if (hit) return hit;

    try {
      const bam = await loadGhostBam({ bamId, serverUrl, ghostDir });
      const atlas = await Assets.load(assetUrl(serverUrl, 'bam', bam.imageName));
      const loaded: LoadedBam = { bam, atlas, textures: new Map() };
      cache.bam.set(bamId, loaded);
      return loaded;
    }
    catch (err: unknown) {
      console.error(err);
    }
  }

  return nothing();
};

const loadSlot = async (
  cache: CreArtCache,
  ini: GhostIni,
  stance: PstAnimStance,
  serverUrl: string,
  ghostDir: string,
): Promise<Maybe<LoadedBam>> => {
  const resref = pstSlotResref(ini, stance);
  if (isNothing(resref)) return nothing();
  return loadBamByResref(cache, resref, serverUrl, ghostDir);
};

const loadCreAnimSet = async (
  cache: CreArtCache,
  cre: string,
  serverUrl: string,
  ghostDir: string,
): Promise<CreAnimSet> => {
  const creId = `${cre}.cre`;
  const ghostCre = await loadGhostCre({ creId, serverUrl, ghostDir });
  const ini = await loadGhostIni({
    iniId: animationIdToIniId(ghostCre.animationId),
    serverUrl,
    ghostDir,
  });

  const walk = await loadSlot(cache, ini, 'walk', serverUrl, ghostDir);
  const stand = await loadSlot(cache, ini, 'stand', serverUrl, ghostDir);
  const run = await loadSlot(cache, ini, 'run', serverUrl, ghostDir);
  const set: CreAnimSet = { walk, stand, run };
  cache.cre.set(cre, set);
  return set;
};

export const ensureCreArt = (
  cache: CreArtCache,
  cre: string,
  serverUrl: string,
  ghostDir: string,
): Promise<CreAnimSet> => {
  const ready = cache.cre.get(cre);
  if (ready) return Promise.resolve(ready);

  const pending = cache.inflight.get(cre);
  if (pending) return pending;

  const work = loadCreAnimSet(cache, cre, serverUrl, ghostDir)
    .catch((err: unknown) => {
      console.error(err);
      const empty: CreAnimSet = { walk: nothing(), stand: nothing(), run: nothing() };
      cache.cre.set(cre, empty);
      return empty;
    })
    .finally(() => {
      cache.inflight.delete(cre);
    });

  cache.inflight.set(cre, work);
  return work;
};
