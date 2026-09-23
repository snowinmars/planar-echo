import {
  getGhostIniAnimationSlot,
  isNothing,
  nothing,
  pstBamCandidates,
} from '@planar/shared';

import { assetUrl } from '@/shared/assetUrl';

import type {
  AssetKey,
  AssetValueOf,
  ClientAssets,
  ClientGhostReader,
  GhostIniAnimation,
  LoadedBamArt,
  LoadedTisArt,
  Maybe,
} from '@planar/shared';

const CONCURRENCY = 4;

type PixiAssets = Readonly<{
  load: (url: string) => Promise<{ source: unknown }>;
  unload?: (url: string) => Promise<unknown>;
}>;

type Entry
  = | Readonly<{ status: 'pending' }>
    | Readonly<{ status: 'ready'; value: unknown }>
    | Readonly<{ status: 'miss' }>;

export type AssetPump = Readonly<{
  assets: ClientAssets;
  unloadAll: () => void;
}>;

export type CreateAssetPumpProps = Readonly<{
  ghost: ClientGhostReader;
  serverUrl: string;
  pixiAssets: PixiAssets;
}>;

const tokenOf = (key: AssetKey): string => {
  switch (key.kind) {
    case 'walk':
      return `walk:${key.fileName}`;
    case 'animation':
      return `animation:${key.id}`;
    case 'are':
    case 'bam':
    case 'wed':
    case 'tis':
    case 'pvrz':
      return `${key.kind}:${key.id}`;
  }
};

export const createAssetPump = ({
  ghost,
  serverUrl,
  pixiAssets,
}: CreateAssetPumpProps): AssetPump => {
  let generation = 0;
  let inflight = 0;
  const entries = new Map<string, Entry>();
  const queued = new Map<string, AssetKey>();
  const followSlots = new Map<number, Set<string>>();
  const pixiUrls = new Set<string>();
  const waiters: Array<() => void> = [];

  const hasWork = (): boolean => queued.size > 0 || inflight > 0;

  const settle = (): void => {
    if (hasWork()) return;
    const pending = waiters.splice(0);
    for (const resolve of pending) resolve();
  };

  const peek = <K extends AssetKey>(key: K): Maybe<AssetValueOf<K>> => {
    const entry = entries.get(tokenOf(key));
    if (!entry || entry.status !== 'ready') return nothing();
    return entry.value as AssetValueOf<K>;
  };

  const enqueueFollowBams = (animationId: number, animation: GhostIniAnimation): void => {
    const slots = followSlots.get(animationId);
    if (!slots) return;
    for (const slot of slots) {
      try {
        const row = getGhostIniAnimationSlot(animation, slot);
        need({ kind: 'bam', id: row.bam });
      }
      catch {
        continue;
      }
    }
  };

  const loadAtlas = async (type: 'bam' | 'tis', fileName: string, jobGen: number): Promise<{ source: unknown }> => {
    const url = assetUrl(serverUrl, type, fileName);
    const atlas = await pixiAssets.load(url);
    if (jobGen === generation) pixiUrls.add(url);
    return atlas;
  };

  const loadBam = async (requested: string, jobGen: number): Promise<Maybe<LoadedBamArt>> => {
    for (const bamId of pstBamCandidates(requested)) {
      try {
        const bam = await ghost.load.bam(bamId);
        const atlas = await loadAtlas('bam', bam.imageName, jobGen);
        return { bam, atlas };
      }
      catch {
        continue;
      }
    }
    return nothing();
  };

  const loadOne = async (key: AssetKey, jobGen: number): Promise<Maybe<unknown>> => {
    switch (key.kind) {
      case 'are':
        return ghost.load.are(key.id);
      case 'animation':
        return ghost.load.animation(key.id);
      case 'bam':
        return loadBam(key.id, jobGen);
      case 'wed':
        return ghost.load.wed(key.id);
      case 'tis': {
        const tis = await ghost.load.tis(key.id);
        const atlas = await loadAtlas('tis', tis.imageName, jobGen);
        return { tis, atlas } satisfies LoadedTisArt;
      }
      case 'pvrz':
        return ghost.load.pvrz(key.id);
      case 'walk': {
        const res = await fetch(assetUrl(serverUrl, 'are', key.fileName), { credentials: 'include' });
        if (res.status === 404) return nothing();
        if (!res.ok) throw new Error(`walk '${key.fileName}': ${res.status}`);
        return new Uint8Array(await res.arrayBuffer());
      }
    }
  };

  const kick = (): void => {
    while (inflight < CONCURRENCY && queued.size > 0) {
      const next = queued.entries().next();
      if (next.done) return;
      const [token, key] = next.value;
      queued.delete(token);
      const jobGen = generation;
      inflight += 1;
      void (async (): Promise<void> => {
        const result = await loadOne(key, jobGen).catch(() => nothing());
        if (jobGen !== generation) {
          settle();
          return;
        }
        inflight -= 1;
        if (isNothing(result)) {
          entries.set(token, { status: 'miss' });
        }
        else {
          entries.set(token, { status: 'ready', value: result });
          if (key.kind === 'animation') {
            enqueueFollowBams(key.id, result as GhostIniAnimation);
          }
        }
        kick();
        settle();
      })();
    }
  };

  const need = (key: AssetKey): void => {
    if (key.kind === 'animation') {
      const slots = followSlots.get(key.id) ?? new Set<string>();
      for (const slot of key.slots ?? []) slots.add(slot);
      followSlots.set(key.id, slots);
    }

    const token = tokenOf(key);
    const entry = entries.get(token);
    if (entry && entry.status === 'ready') {
      const isAnimation = key.kind === 'animation';
      if (isAnimation) enqueueFollowBams(key.id, entry.value as GhostIniAnimation);
      kick();
      return;
    }
    const alreadyKnown = entry?.status === 'pending' || entry?.status === 'miss';
    if (alreadyKnown) return;
    if (queued.has(token)) return;

    entries.set(token, { status: 'pending' });
    queued.set(token, key);
    kick();
  };

  const waitAllLoadings = async (): Promise<void> => {
    kick();
    if (!hasWork()) return;
    await new Promise<void>((resolve) => {
      waiters.push(resolve);
    });
  };

  const unloadAll = (): void => {
    generation += 1;
    inflight = 0;
    queued.clear();
    entries.clear();
    followSlots.clear();
    const urls = [...pixiUrls];
    pixiUrls.clear();
    const unload = pixiAssets.unload;
    if (unload) {
      for (const url of urls) {
        unload(url).catch((err: unknown) => console.error(err));
      }
    }
    const pending = waiters.splice(0);
    for (const resolve of pending) resolve();
  };

  return {
    assets: {
      need,
      peek,
      waitAllLoadings,
    },
    unloadAll,
  };
};
