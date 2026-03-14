import type { Maybe } from '../../../../shared/maybe.js';
import type { Item } from '../../tlk/v1.types/2.item.js';
import type { DlgResponse } from './3.response.js';
import type { DlgFunction } from './4.function.js';

export type StateOrigin = Readonly<{
  stateIndex: number;
  responseIndex: number;
}>;

export type RawState = Readonly<{
  index: number;
  textRef: number;
  firstResponseIndex: number;
  responsesCount: number;
  triggerIndex: number;
  textTlk: Maybe<Item>;
  stateOrigins: StateOrigin[];
  weightStates: number[];
}>;

export type DlgState = Readonly<{
  index: number;
  textRef: number;
  responses: DlgResponse[];
  trigger: Maybe<DlgFunction>;
  action: string | null;
  textTlk: Maybe<Item>;
  origins: StateOrigin[];
  weightStates: number[];
}>;
