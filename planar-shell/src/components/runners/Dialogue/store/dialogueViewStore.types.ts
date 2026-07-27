import type {
  DialogueResponse,
  DialogueSay,
  Maybe,
} from '@planar/shared';
import type { DisposeFunction } from './helpers';

export type DialogueViewResponse = Readonly<{
  response: DialogueResponse;
  index: number;
  kind: 'default' | 'destructor' | 'extern';
  marker: string;
}>;

export type CurrentDialogueView = Readonly<{
  says: DialogueSay[];
  responses: DialogueViewResponse[];
  tlkRefs: number[];
  useTwoColumns: boolean;
}>;

export type DialogueViewStore = Readonly<{
  view: Maybe<CurrentDialogueView>;
  refresh: DisposeFunction;
  start: () => DisposeFunction;
}>;
