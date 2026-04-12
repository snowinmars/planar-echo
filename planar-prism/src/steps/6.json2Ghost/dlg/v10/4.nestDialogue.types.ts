import type { RawHeader } from '@/steps/4.biffs2json/dlg/v1.types/1.header.js';
import type { RawResponse } from '@/steps/4.biffs2json/dlg/v1.types/3.response.js';
import type { RawFunction } from '@/steps/4.biffs2json/dlg/v1.types/4.function.js';
import type { Maybe } from '@planar/shared';

export type NestedDlgHeader = RawHeader;
export type NestedDlgFunction = Pick<RawFunction, 'index' | 'text'>;

export type NestedDlgState = Readonly<{
  index: number;
  responses: NestedDlgResponse[];
  trigger: Maybe<NestedDlgFunction>;
  action: Maybe<string>; // this is action, that is not presented in source code, so it can be set only manually
  textTlk: Maybe<string>;
}>;

export type NestedDlgResponse = Readonly<{
  index: number;
  flags: RawResponse['flags'];
  trigger: Maybe<NestedDlgFunction>;
  action: Maybe<NestedDlgFunction>;
  nextDialog: Maybe<string>;
  nextDialogState: Maybe<number>;
  textTlk: Maybe<string>;
  journalId: Maybe<number>;
  journalTlk: Maybe<string>;
}>;

export type NestedDlg = Readonly<{
  resourceName: string;
  header: NestedDlgHeader;
  states: NestedDlgState[];
  stateIndicesOrderedByWeight: number[];
}>;
