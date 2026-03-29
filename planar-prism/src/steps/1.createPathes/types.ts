import type { GameName, GameLanguage } from '@planar/shared';

type OutDir = Readonly<{
  dialogues: string;
  ids: string;
  inis: string;
  creatures: string;
  effects: string;
  items: string;
}>;
type SaveFunction = (resourceName: string, entry: unknown) => Promise<void>;
type OutSave = Readonly<{
  dialogues: SaveFunction;
  ids: SaveFunction;
  inis: SaveFunction;
  creatures: SaveFunction;
  effects: SaveFunction;
  items: SaveFunction;
}>;
export type Pathes = Readonly<{
  weiduExe: string;
  gameFolder: string;
  tlkPath: string;
  gameName: GameName;
  gameLanguage: GameLanguage;
  output: Readonly<{
    root: string;
    decimpiledBiff: Readonly<{
      root: string;
      cacheJson: string;
    }>;
    json: OutDir;
    saveJson: OutSave;
    ghost: OutDir;
    saveGhost: OutSave;
  }>;
}>;
