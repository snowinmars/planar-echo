import { GameLanguage } from './gameLanguage';
import { GameName } from './gameName';

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
export type PrismIndexProgressMessage = Readonly<{
  type: 'progress';
  data: Readonly<{
    percent: number;
    step: string;
  }>;
}>;
export type PrismIndexCompleteMessage = Readonly<{
  type: 'complete';
}>;
export type PrismIndexErrorMessage = Readonly<{
  type: 'error';
  data: string;
}>;
