import type { Maybe } from '@planar/shared';
import type { RawState } from '@/steps/4.biffs2json/dlg/v1.types/2.states.js';
import type { RawResponse } from '@/steps/4.biffs2json/dlg/v1.types/3.response.js';
import type { WeightedDlg } from './1.attachWeights.types.js';

export type TlkedState = RawState & Readonly<{
  textTlk: Maybe<string>;
}>;

export type TlkedResponse = RawResponse & Readonly<{
  textTlk: Maybe<string>;
  journalTlk: Maybe<string>;
}>;

export type TlkedDlg = Omit<WeightedDlg, 'states' | 'responses'> & Readonly<{
  states: TlkedState[];
  responses: TlkedResponse[];
}>;
