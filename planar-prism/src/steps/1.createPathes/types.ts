export type GameName
  = | 'bg1'
    | 'bg1ee'
    | 'bg2'
    | 'bg2ee'
    | 'iwd'
    | 'iwdee'
    | 'iwd2'
    | 'iwd2ee'
    | 'pst'
    | 'pstee';
;
export type Lang
  = | 'cs_CZ'
    | 'de_DE'
    | 'en_US'
    | 'fr_FR'
    | 'ko_KR'
    | 'pl_PL'
    | 'ru_RU'
;
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
  gameName: GameName;
  tlkPath: string;
  lang: Lang;
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
