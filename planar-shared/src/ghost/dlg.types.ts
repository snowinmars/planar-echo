import type { ItmId } from '../dlgEngine/enums/itm.js';
import type { ResponseId } from '../dlgEngine/enums/response.js';
import type { StateId } from '../dlgEngine/enums/state.js';
import type { WhoId } from '../dlgEngine/enums/who.js';
import type { Maybe } from '../maybe.js';

export type GhostDlgEngineInstructionPlaySound = Readonly<{
  id: 'playSound';
  args: {
    sound: string; // TODO [snow]: entype as SoundId
  };
}>;

export type GhostDlgEngineInstruction
  = | GhostDlgEngineInstructionPlaySound
;
export type GhostDlgConditionCallback = () => boolean;
export type GhostDlgActionCallback = () => Maybe<GhostDlgEngineInstruction>;
export type GhostDlgArgs = Readonly<{
  onlyIf?: Maybe<GhostDlgConditionCallback>;
  weight?: Maybe<number>;
  onEnter?: Maybe<GhostDlgActionCallback>;
}>
;

export type GhostDlg = Readonly<{
  resourceName: string;
  tree: Map<StateId, GhostDlgLabel>;
  constructorsWeights: Map<StateId, number>;
}>
;
export type GhostDlgLabel = Readonly<{
  stateId: StateId;
  args: Maybe<GhostDlgArgs>;
  says: GhostDlgSay[];
  responses: GhostDlgResponse[];
  jump: Maybe<GhostDlgJump>;
}>
;
export type GhostDlgSay = Readonly<{
  textRef: number;
  whoId: WhoId | ItmId;
  whoIdRef: number;
  sayId: string;
  args: Maybe<GhostDlgArgs>;
}>
;
export type GhostDlgResponse = Readonly<{
  responseRef: Maybe<number>;
  responseId: ResponseId;
  jumpTo: StateId;
  args: Maybe<GhostDlgArgs>;
}>
;
export type GhostDlgJump = Readonly<{
  jumpTo: StateId;
  args: Maybe<GhostDlgArgs>;
}>
;
