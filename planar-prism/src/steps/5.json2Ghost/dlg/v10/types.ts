import type { Maybe } from '@planar/shared';
import type { RawDlg } from '@/steps/4.biffs2json/dlg/index.js';
import type { RawHeader } from '@/steps/4.biffs2json/dlg/v1.types/1.header.js';
import type { Item } from '@/steps/4.biffs2json/tlk/v1.types/2.item.js';
import type { RawResponse } from '@/steps/4.biffs2json/dlg/v1.types/3.response.js';
import type { RawState } from '@/steps/4.biffs2json/dlg/v1.types/2.states.js';

export type GhostDlgHeader = RawHeader;

export type GhostDlgFunction = Readonly<{
  index: number;
  offset: number;
  length: number;
  text: string;
}>;

export type GhostDlgState = Readonly<{
  index: number;
  textRef: number;
  responses: GhostDlgResponse[];
  trigger: Maybe<GhostDlgFunction>;
  action: Maybe<string>;
  textTlk: Maybe<string>;
}>;

export type GhostDlgResponse = Readonly<{
  index: number;
  flags: RawResponse['flags'];
  textRef: Maybe<number>;
  journalRef: Maybe<number>;
  trigger: Maybe<GhostDlgFunction>;
  action: Maybe<GhostDlgFunction>;
  nextDialog: Maybe<string>;
  nextDialogState: Maybe<number>;
  textTlk: Maybe<string>;
  journalTlk: Maybe<string>;
}>;

export type GhostDlg = Readonly<{
  resourceName: string;
  header: GhostDlgHeader;
  states: GhostDlgState[];
  stateIndicesOrderedByWeight: number[];
}>;

export type WeightedDlg = Readonly<{
  resourceName: string;
  header: RawHeader;
  states: RawState[];
  responses: RawResponse[];
  stateTriggers: Map<number, GhostDlgFunction>;
  responsesTriggers: Map<number, GhostDlgFunction>;
  responsesActions: Map<number, GhostDlgFunction>;
  stateIndicesOrderedByWeight: number[];
}>;

export type TlkedState = Readonly<{
  index: number;
  textRef: number;
  firstResponseIndex: number;
  responsesCount: number;
  triggerIndex: number;
  textTlk: Maybe<string>;
}>;

export type TlkedResponse = Readonly<{
  index: number;
  flags: RawResponse['flags'];
  textRef: Maybe<number>;
  journalRef: Maybe<number>;
  triggerIndex: Maybe<number>;
  actionIndex: Maybe<number>;
  nextDialog: Maybe<string>;
  nextDialogState: Maybe<number>;
  textTlk: Maybe<string>;
  journalTlk: Maybe<string>;
}>;

export type TlkedDlg = Readonly<{
  resourceName: string;
  header: RawHeader;
  states: TlkedState[];
  responses: TlkedResponse[];
  stateTriggers: Map<number, GhostDlgFunction>;
  responsesTriggers: Map<number, GhostDlgFunction>;
  responsesActions: Map<number, GhostDlgFunction>;
  stateIndicesOrderedByWeight: number[];
}>;
