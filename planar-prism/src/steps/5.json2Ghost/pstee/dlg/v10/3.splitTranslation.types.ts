import type { Maybe } from '@planar/shared';
import type { TlkedDlg, TlkedState } from './2.patchTranslation.types.js';

export type SplittedDlg = Omit<TlkedDlg, 'states'> & Readonly<{
  states: SplittedState[];
}>;

export type SplittedState = TlkedState & Readonly<{
  action: Maybe<string>;
  textTlkSplits: number[];
}>;
