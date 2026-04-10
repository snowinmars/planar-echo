import type { GameLanguage } from './gameLanguage.js';
import type { GameName } from './gameName.js';
import type { Maybe } from './index.js';

/**
 * Props to file prism index.js
 */
type PrismIndexProps = Readonly<{
  weiduExe: string;
  chitinKey: string;
  ghost: string;
  gameLanguage: GameLanguage;
  gameName: GameName;
}>;

export type PrismIndexStartMessage = Readonly<{
  type: 'start';
  data: PrismIndexProps;
}>;
export const progressSteps = [
  'decompileBiffs', // value 0
  'ids_raw2json', // value: number in percent; params: {resourceName: string}
  'cre_raw2json', // here and below reportProgress params is : value: number in percent; params: {version: string, resourceName: string}
  'dlg_raw2json',
  'effV10_raw2json',
  'effV20_raw2json',
  'ini_raw2json',
  'itm_raw2json',
  'tlk_raw2json',
  'cre_json2ghost',
  'dlg_json2ghost',
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
}>;
export type PrismIndexErrorMessage = Readonly<{
  type: 'error';
  data: string;
}>;
