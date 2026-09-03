import type {
  GhostDlgResponse,
  GhostDlgSay,
  Maybe,
} from '@planar/shared';

import type { DisposeFunction } from './helpers';

export type DlgViewResponse = Readonly<{
  response: GhostDlgResponse;
  index: number;
  kind: 'default' | 'destructor' | 'extern';
  marker: string;
}>;

export type CurrentDlgView = Readonly<{
  says: GhostDlgSay[];
  responses: DlgViewResponse[];
  tlkRefs: number[];
  useTwoColumns: boolean;
}>;

export type DlgViewStore = Readonly<{
  view: Maybe<CurrentDlgView>;
  refresh: DisposeFunction;
  start: () => DisposeFunction;
}>;
