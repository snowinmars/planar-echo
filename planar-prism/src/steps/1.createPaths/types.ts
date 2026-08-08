import type { GameName, GameLanguage } from '@planar/shared';

type OutDir = Readonly<{
  root: string;
  tlk: string;
  dialogues: string;
  ids: string;
  inis: string;
  creatures: string;
  effects: string;
  items: string;
  bcs: string;
}>;
type SaveFunction = (resourceName: string, entry: unknown, asIs?: boolean) => Promise<void>;
type OutSave = Readonly<{
  tlk: SaveFunction;
  dialogues: SaveFunction;
  ids: SaveFunction;
  inis: SaveFunction;
  creatures: SaveFunction;
  effects: SaveFunction;
  items: SaveFunction;
  bcs: SaveFunction;
}>;
export type Paths = Readonly<{
  weiduExeDir: string;
  prismDir: string;
  gameDir: string;
  tlkDir: string;
  gameName: GameName;
  gameLanguage: GameLanguage;
  ghostDir: Readonly<{
    root: string;
    decompiledBiff: Readonly<{
      root: string;
      cacheJson: string;
    }>;
    json: OutDir;
    saveJson: OutSave;
    ghost: OutDir;
    saveGhost: OutSave;
    sharedEnums: string;
    stores: string;
  }>;
}>;
