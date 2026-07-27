import type { RawHeader } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/1.parseHeader.types.js';
import type { RawResponse } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/3.parseResponses.types.js';
import type { RawFunction } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/4.parseFunctions.types.js';
import type { Maybe } from '@planar/shared';

export type NestedDlgHeader = RawHeader;
export type NestedDlgFunction = Pick<RawFunction, 'index' | 'text'>;

export type NestedDlgState = Readonly<{
  index: number;
  responses: NestedDlgResponse[];
  trigger: Maybe<NestedDlgFunction>;
  action: Maybe<string>; // this action prop is not presented in source code, so it can be set only manually, if required
  textRef: number;
}>;

export type NestedDlgResponse = Readonly<{
  index: number;
  flags: RawResponse['flags'];
  trigger: Maybe<NestedDlgFunction>;
  action: Maybe<NestedDlgFunction>;
  nextDialog: Maybe<string>;
  nextDialogState: Maybe<number>;
  textRef: Maybe<number>;
  journalRef: Maybe<number>;
}>;

export type NestedDlg = Readonly<{
  resourceName: string;
  header: NestedDlgHeader;
  states: NestedDlgState[];
  stateIndicesOrderedByWeight: number[];
}>;
