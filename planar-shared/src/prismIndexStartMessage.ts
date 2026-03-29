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
export type ProgressStep
  = | 'decompileBiffs' // value 0
    | 'parseCre' // value:%; params: {version, resourceName}
    | 'parseDlg' // value:%; params: {version, resourceName}
    | 'parseEffV10' // value:%; params: {version, resourceName}
    | 'parseEffV20' // value:%; params: {version, resourceName}
    | 'parseIds' // value:%; params: {resourceName}
    | 'parseIni' // value:%; params: {version, resourceName}
    | 'parseItm' // value:%; params: {version, resourceName}
 ;
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
