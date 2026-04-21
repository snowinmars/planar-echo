import { just, nothing } from '../maybe.js';
import { createSayId } from './common.js';

import type { Maybe } from '../maybe.js';
import type { GameLanguage } from '../gameLanguage.js';
import type { StateId } from './enums/state.js';
import type { WhoId } from './enums/who.js';
import type { ResponseId } from './enums/response.js';
import type {
  UntranslatedNpcDialogue,
  UntranslatedLabel,
} from './registerNpcDialogue.types.js';
import type {
  NpcDialogue,
  Label,
  Say,
  Response,
} from './translateNpcDialogue.types.js';

type LabelFunction = (stateId: StateId) => Readonly<{ say: SayFunction }>;
type SayFunction = (whoId: WhoId, what: string) => Readonly<{ say: SayFunction; response: ResponseFunction }>;
type ResponseFunction = (responseId: ResponseId, what: string) => Readonly<{ response: ResponseFunction; flush: FlushFunction }>;
type FlushFunction = () => NpcDialogue;

const throwIfInvalidUntranslatedLabel = (unstranslatedLabel: UntranslatedLabel, stateId: StateId): void => {
  if (!unstranslatedLabel) throw new Error(`Label ${stateId} was not registrated.`);

  const untranslatedSays = unstranslatedLabel.says.get('dev');
  if (!untranslatedSays) throw new Error(`Cannot find dev says for unstranslated label ${unstranslatedLabel.stateId}`);
  if (untranslatedSays.length !== 1) throw new Error(`Wrong dev says count for unstranslated label ${unstranslatedLabel.stateId}: expect 1 but got ${untranslatedSays.length}`);

  const untranslatedSay = untranslatedSays[0];
  if (!untranslatedSay) throw new Error(`Find dev says, but not find the say item for unstranslated label ${unstranslatedLabel.stateId}`);

  const untranslatedResponses = unstranslatedLabel.responses.get('dev');
  if (!untranslatedResponses) throw new Error(`Cannot find dev responses for unstranslated label ${unstranslatedLabel.stateId}`);
};

export const translateNpcDialogue = (untranslatedNpcDialogue: UntranslatedNpcDialogue, language: GameLanguage): { label: LabelFunction; expose: () => NpcDialogue } => {
  let _unstranslatedLabel: Maybe<UntranslatedLabel> = nothing();
  let _label: Maybe<Label> = nothing();
  const npcDialogue: NpcDialogue = {
    tree: new Map<StateId, Label>(),
    constructorsWeights: untranslatedNpcDialogue.constructorsWeights,
  };

  const label: LabelFunction = (stateId) => {
    _unstranslatedLabel = untranslatedNpcDialogue.tree.get(stateId)!;
    throwIfInvalidUntranslatedLabel(_unstranslatedLabel, stateId);

    const isFirstRun = !_label;
    if (!isFirstRun) {
      flush();
    }

    _label = {
      stateId: _unstranslatedLabel.stateId,
      args: _unstranslatedLabel.args,
      says: new Map<GameLanguage, Say[]>(),
      responses: new Map<GameLanguage, Response[]>(),
      jump: _unstranslatedLabel.jump,
    };

    _label.says.set(language, []);
    _label.responses.set(language, []);

    return {
      say,
    };
  };

  const say: SayFunction = (whoId: WhoId, what: string) => {
    const untranslatedSays = _unstranslatedLabel!.says.get('dev')!;
    const untranslatedSay = untranslatedSays[0];
    const says = _label!.says.get(language)!;

    const isFirstSay = says.length === 0;
    says.push({
      sayId: createSayId(_label!.stateId, says.length),
      args: isFirstSay ? untranslatedSay.args : nothing(),
      whoId,
      what,
    });

    return {
      say,
      response,
    };
  };

  const response: ResponseFunction = (responseId: string, what: string) => {
    const untranslatedResponses = _unstranslatedLabel!.responses.get('dev')!;
    const untranslatedResponse = untranslatedResponses.find(x => x.responseId === responseId)!;
    if (!untranslatedResponse) throw new Error(`Response ${responseId} does not exist on label ${_unstranslatedLabel!.stateId}`);

    _label!.responses.get(language)!.push({
      responseId,
      args: untranslatedResponse.args,
      jumpTo: untranslatedResponse.jumpTo,
      what,
    });

    return {
      response,
      // label,
      flush,
    };
  };

  const flush: FlushFunction = () => {
    /*
     * builer guarantees that:
     * - stateId is set
     * - at least one SayItem is set
     * - at least one responseItem or JumpItem is set
     */
    const l = just(_label);
    npcDialogue.tree.set(l.stateId, { ...l });

    return npcDialogue;
  };

  const expose = () => npcDialogue;

  return {
    label,
    expose,
  };
};
