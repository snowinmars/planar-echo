import type { GhostAre } from '../ghost/are.types.js';
import type { GhostBam } from '../ghost/bam.types.js';
import type { GhostIniAnimation } from '../ghost/ini.types.js';
import type { GhostIniAnimationSlotKey } from '../ghost/iniKind.js';
import type { GhostPvr } from '../ghost/pvr.types.js';
import type { GhostTis } from '../ghost/tis.types.js';
import type { GhostWed } from '../ghost/wed.types.js';
import type { Maybe } from '../maybe.js';

export type AssetAtlas = Readonly<{
  source: unknown;
}>;

export type LoadedBamArt = Readonly<{
  bam: GhostBam;
  atlas: AssetAtlas;
}>;

export type LoadedTisArt = Readonly<{
  tis: GhostTis;
  atlas: AssetAtlas;
}>;

export type AssetKey
  = | Readonly<{ kind: 'are'; id: string }>
    | Readonly<{ kind: 'animation'; id: number; slots?: readonly GhostIniAnimationSlotKey[] }>
    | Readonly<{ kind: 'bam'; id: string }>
    | Readonly<{ kind: 'wed'; id: string }>
    | Readonly<{ kind: 'tis'; id: string }>
    | Readonly<{ kind: 'pvrz'; id: string }>
    | Readonly<{ kind: 'walk'; fileName: string }>;

/* eslint-disable @stylistic/no-multi-spaces */
export type AssetValueOf<K extends AssetKey>
  = K extends { kind: 'are'       } ? GhostAre
    : K extends { kind: 'animation' } ? GhostIniAnimation
      : K extends { kind: 'bam'       } ? LoadedBamArt
        : K extends { kind: 'wed'       } ? GhostWed
          : K extends { kind: 'tis'       } ? LoadedTisArt
            : K extends { kind: 'pvrz'       } ? GhostPvr
              : K extends { kind: 'walk'       } ? Uint8Array
                : never;
/* eslint-enable */

export type ClientAssets = Readonly<{
  need: (key: AssetKey) => void;
  peek: <K extends AssetKey>(key: K) => Maybe<AssetValueOf<K>>;
  waitAllLoadings: () => Promise<void>;
}>;
