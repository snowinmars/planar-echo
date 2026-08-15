// raw means raw structure from biff
// dlg means nested structure, that is easier to use

import type { RawDlgHeader } from './v1/parsers/1.parseHeader.types.js';
import type { RawDlgState } from './v1/parsers/2.parseStates.types.js';
import type { RawDlgResponse } from './v1/parsers/3.parseResponses.types.js';
import type { RawDlgFunction } from './v1/parsers/4.parseFunctions.types.js';

export type RawDlgSignature = 'dlg';
export type RawDlgVersions = 'v1.0';

export type RawDlg = Readonly<{
  resourceName: string;
  header: RawDlgHeader;
  states: RawDlgState[];
  responses: RawDlgResponse[];
  stateTriggers: Map<number, RawDlgFunction>;
  responsesTriggers: Map<number, RawDlgFunction>;
  responsesActions: Map<number, RawDlgFunction>;
}>;
