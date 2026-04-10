import type { SplittedState } from './3.splitTranslation.types.js';
import type { TlkedState } from './2.patchTranslation.types.js';

export type Splitter = (state: TlkedState) => SplittedState;
