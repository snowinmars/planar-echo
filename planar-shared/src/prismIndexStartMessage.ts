import type { GameLanguage } from './gameLanguage.js';
import type { GameName } from './gameName.js';
import type { Progress } from './progress.js';

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

export type PrismIndexProgressMessage = Readonly<{
  type: 'progress';
  data: Progress;
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
