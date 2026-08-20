import type { GameLanguage } from './gameLanguage.js';
import type { GameName } from './gameName.js';
import type { Maybe } from './index.js';

/**
 * Props to file prism index.js // TODO [snow]: write normal way, lol
 */
type PrismIndexProps = Readonly<{
  weiduExeDir: string;
  chitinKeyFile: string;
  prismDir: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
  gameName: GameName;
}>;

export type PrismIndexStartMessage = Readonly<{
  type: 'start';
  data: PrismIndexProps;
}>;
export const progressSteps = [ // TODO [snow]: entype
  'buildPrism', // value 0
  'decompileBiffs', // value 0
  'tlk_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'ids_raw2json', // value: number in percent; params: {resourceName: string}
  'bcs_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'ini_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'cre_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'dlg_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'effV10_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'effV20_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'itm_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'wed_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'pvrz_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'mos_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'tis_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'bmp_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'bam_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'wav_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'acm_raw2json', // value: number in percent; params: {version: string, resourceName: string}
  'mus_raw2json', // value: number in percent; params: {resourceName: string}
  'tlk_json2ghost', // value: number in percent; params: {index: number}
  'ids_json2ghost', // value: number in percent; params: {resourceName: string}
  'bcs_json2ghost', // value: number in percent; params: {resourceName: string}
  'ini_json2ghost', // value: number in percent; params: {resourceName: string}
  'cre_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'dlg_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'eff_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'itm_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'wed_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'pvrz_json2ghost', // value: number in percent; params: {resourceName: string}
  'mos_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'tis_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'bmp_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'bam_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'wav_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'acm_json2ghost', // value: number in percent; params: {version: string, resourceName: string}
  'mus_json2ghost', // value: number in percent; params: {resourceName: string}
  'buildGhost', // value: number in percent
] as const;
export type ProgressStep = typeof progressSteps[number];

export type PrismIndexProgressMessage = Readonly<{
  type: 'progress';
  data: Readonly<{
    value: number;
    step: ProgressStep;
    params?: Maybe<Record<string, string>>;
  }>;
}>;
export type PrismIndexCompleteMessage = Readonly<{
  type: 'complete';
  data: string;
}>;
export type PrismIndexErrorMessage = Readonly<{
  type: 'error';
  data: string;
}>;
export type PrismIndexReadyMessage = Readonly<{
  type: 'ready';
}>;
