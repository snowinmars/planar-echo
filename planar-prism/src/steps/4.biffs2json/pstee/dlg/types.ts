// raw means raw structure from biff
// dlg means nested structure, that is easier to use

import type { RawHeader } from './v1/parsers/1.parseHeader.types.js';
import type { RawState } from './v1/parsers/2.parseStates.types.js';
import type { RawResponse } from './v1/parsers/3.parseResponses.types.js';
import type { RawFunction } from './v1/parsers/4.parseFunctions.types.js';

export type Signature = 'dlg';
export type Versions = 'v1.0';

export type RawDlg = Readonly<{
  resourceName: string;
  header: RawHeader;
  states: RawState[];
  responses: RawResponse[];
  stateTriggers: Map<number, RawFunction>;
  responsesTriggers: Map<number, RawFunction>;
  responsesActions: Map<number, RawFunction>;
}>;
