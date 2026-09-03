import type { Maybe } from '@planar/shared';

import type { RawDlgHeader } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/1.parseHeader.types.js';
import type { RawDlgResponse } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/3.parseResponses.types.js';
import type { RawDlgFunction } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/4.parseFunctions.types.js';

export type NestedDlgHeader = RawDlgHeader;
export type NestedDlgFunction = Pick<RawDlgFunction, 'index' | 'text'>;

export type NestedDlgState = Readonly<{
  index: number;
  responses: NestedDlgResponse[];
  trigger: Maybe<NestedDlgFunction>;
  action: Maybe<string>; // this action prop is not presented in source code, so it can be set only manually, if required
  textRef: number;
}>;

export type NestedDlgResponse = Readonly<{
  index: number;
  flags: RawDlgResponse['flags'];
  trigger: Maybe<NestedDlgFunction>;
  action: Maybe<NestedDlgFunction>;
  nextDlg: Maybe<string>;
  nextDlgState: Maybe<number>;
  textRef: Maybe<number>;
  journalRef: Maybe<number>;
}>;

export type NestedDlg = Readonly<{
  resourceName: string;
  header: NestedDlgHeader;
  states: NestedDlgState[];
  stateIndicesOrderedByWeight: number[];
}>;
