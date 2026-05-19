import type { Maybe } from '@planar/shared';
import type { RawState } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/2.parseStates.types.js';
import type { RawResponse } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/3.parseResponses.types.js';
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
