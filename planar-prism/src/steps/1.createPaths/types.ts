import type { GameName, GameLanguage } from '@planar/shared';

type OutDir = Readonly<{
  root: string;
  tlk: string;
  dlg: string;
  ids: string;
  ini: string;
  cre: string;
  eff: string;
  itm: string;
  bcs: string;
  wed: string;
  pvrz: string;
  tis: string;
  mos: string;
  bmp: string;
  bam: string;
  wav: string;
  acm: string;
  mus: string;
}>;
type SaveFunction = (resourceName: string, entry: unknown, asIs?: boolean) => Promise<void>;
type SaveBinaryFunction = (resourceName: string, data: Buffer) => Promise<void>;
type OutSave = Readonly<{
  tlk: SaveFunction;
  dlg: SaveFunction;
  ids: SaveFunction;
  ini: SaveFunction;
  cre: SaveFunction;
  eff: SaveFunction;
  itm: SaveFunction;
  bcs: SaveFunction;
  wed: SaveFunction;
  pvrz: SaveFunction;
  tis: SaveFunction;
  mos: SaveFunction;
  bmp: SaveFunction;
  bam: SaveFunction;
  wav: SaveFunction;
  acm: SaveFunction;
  mus: SaveFunction;
}>;
type OutSaveBinary = Readonly<{
  tis: Readonly<{
    image: SaveBinaryFunction;
    palette: SaveBinaryFunction;
    indices: SaveBinaryFunction;
  }>;
  mos: Readonly<{
    image: SaveBinaryFunction;
    palette: SaveBinaryFunction;
    indices: SaveBinaryFunction;
  }>;
  bmp: Readonly<{
    image: SaveBinaryFunction;
    palette: SaveBinaryFunction;
    indices: SaveBinaryFunction;
  }>;
  bam: Readonly<{
    image: SaveBinaryFunction;
    palette: SaveBinaryFunction;
    indices: SaveBinaryFunction;
  }>;
  wav: Readonly<{
    audio: SaveBinaryFunction;
  }>;
  acm: Readonly<{
    audio: SaveBinaryFunction;
  }>;
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
    cache: Readonly<{
      root: string;
      xorKey: string;
    }>;
    decompiledBiff: Readonly<{
      root: string;
      cacheJson: string;
    }>;
    json: OutDir;
    saveJson: OutSave;
    saveBinary: OutSaveBinary;
    ghost: OutDir;
    saveGhost: OutSave;
    sharedEnums: string;
    stores: string;
  }>;
}>;
