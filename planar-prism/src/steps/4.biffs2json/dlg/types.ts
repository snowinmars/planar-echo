// raw means raw structure from biff
// dlg means nested structure, that is easier to use

import type { RawHeader } from './v1.types/1.header.js';
import type { RawState } from './v1.types/2.states.js';
import type { RawResponse } from './v1.types/3.response.js';
import type { RawFunction } from './v1.types/4.function.js';

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
