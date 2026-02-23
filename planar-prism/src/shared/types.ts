export enum Lang {
  cs = 'cs_CZ',
  de = 'de_DE',
  en = 'en_US',
  fr = 'fr_FR',
  ko = 'ko_KR',
  pl = 'pl_PL',
  ru = 'ru_RU',
}
export enum DecompiledItemType {
  twoda = '2da',
  are = 'are',
  bam = 'bam',
  bcs = 'bcs',
  bmp = 'bmp',
  chu = 'chu',
  cre = 'cre',
  dlg = 'dlg',
  eff = 'eff',
  glsl = 'glsl',
  ids = 'ids',
  ini = 'ini',
  itm = 'itm',
  lua = 'lua',
  menu = 'menu',
  mos = 'mos',
  pvrz = 'pvrz',
  pro = 'pro',
  qsp = 'qsp',
  spl = 'spl',
  src = 'src',
  sto = 'sto',
  tis = 'tis',
  tlk = 'tlk',
  ttf = 'ttf',
  vvc = 'vvc',
  wav = 'wav',
  wbm = 'wbm',
  wed = 'wed',
  wmp = 'wmp',
}
export type Pathes = Readonly<{
  weidu: string;
  game: string;
  tlkPath: string;
  lang: Lang;
  output: Readonly<{
    root: string;
    decimpiledBiff: string;
    decimpiledBiffJson: string;
    jsonDialogues: string;
  }>;
}>;
export type Biff = Readonly<{
  name: string;
  sizeBytes: number;
}>;
export type DecompiledItem = Readonly<{
  name: string;
  fromBiff: string;
  type: DecompiledItemType;
}>;
export type Nothing = null | undefined | void;
export type Maybe<T> = NonNullable<T> | Nothing;
export const just = <T>(maybe: Maybe<T>): T => {
  if (maybe) return maybe;
  throw new Error('Null reference exception');
};
export const maybe = <T>(value: T): Maybe<T> => value ?? null;
