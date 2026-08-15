import type { Maybe } from '../maybe.js';
import type { GhostDlgEngineInstruction } from '../ghost/dlg.types.js';

export type InternalConditionCallback<T> = (logic: T) => boolean;
export type InternalActionCallback<T> = (logic: T) => Maybe<GhostDlgEngineInstruction>;
export type InternalArgsProps<T> = Readonly<{
  onlyIf?: Maybe<InternalConditionCallback<T>>;
  weight?: Maybe<number>;
  onEnter?: Maybe<InternalActionCallback<T>>;
}>
;
