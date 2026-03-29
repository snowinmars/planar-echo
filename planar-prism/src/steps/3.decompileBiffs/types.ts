import type { Pathes } from '@/steps/1.createPathes/index.js';

export type ListBiffsProps = Readonly<{
  weiduExe: Pathes['weiduExe'];
  gameFolder: Pathes['gameFolder'];
  gameLanguage: Pathes['gameLanguage'];
}>;
export type DecompileBiffsProps = ListBiffsProps & Readonly<{
  output: Pathes['output'];
}>;
export type DecompiledBiffType
  = | '2da'
    | 'are'
    | 'bam'
    | 'bcs'
    | 'bmp'
    | 'chu'
    | 'cre'
    | 'dlg'
    | 'eff'
    | 'glsl'
    | 'gam'
    | 'ids'
    | 'ini'
    | 'itm'
    | 'lua'
    | 'menu'
    | 'mos'
    | 'pvrz'
    | 'pro'
    | 'qsp'
    | 'spl'
    | 'src'
    | 'sto'
    | 'tis'
    | 'tlk'
    | 'ttf'
    | 'vvc'
    | 'wav'
    | 'wbm'
    | 'wed'
    | 'wmp'
;
export type Biff = Readonly<{
  resourceName: string;
  sizeBytes: number;
}>;
export type DecompiledBiff = Readonly<{
  resourceName: string;
  fromBiffResourceName: string;
  type: DecompiledBiffType;
}>;
