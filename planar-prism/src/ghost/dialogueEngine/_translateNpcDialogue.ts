// import { just } from '@planar/shared';
import { createSayId, just } from './_types.js';

// import type { Maybe, GameLanguage } from '@planar/shared';
import type { LabelId, NpcId, ResponseId } from './_enums.js';
import type {
  Maybe,
  GameLanguage,
  NpcDialogue,
  Label,
  Say,
  Response,
  UntranslatedNpcDialogue,
  UntranslatedLabel,
} from './_types.js';

type LabelFunction<T> = (labelId: LabelId) => Readonly<{ say: SayFunction<T> }>;
type SayFunction<T> = (who: NpcId, what: string) => Readonly<{ say: SayFunction<T>; response: ResponseFunction<T> }>;
type ResponseFunction<T> = (responseId: ResponseId, what: string) => Readonly<{ response: ResponseFunction<T>; label: LabelFunction<T>; done: DoneFunction<T> }>;
type DoneFunction<T> = () => NpcDialogue<T>;

const throwIfInvalidUntranslatedLabel = <T>(unstranslatedLabel: UntranslatedLabel<T>, labelId: LabelId): void => {
  if (!unstranslatedLabel) throw new Error(`Label ${labelId} was not registrated.`);

  const untranslatedSays = unstranslatedLabel.says.get('dev');
  if (!untranslatedSays) throw new Error(`Cannot find dev says for unstranslated label ${unstranslatedLabel.labelId}`);
  if (untranslatedSays.length !== 1) throw new Error(`Wrong dev says count for unstranslated label ${unstranslatedLabel.labelId}: expect 1 but got ${untranslatedSays.length}`);

  const untranslatedSay = untranslatedSays[0];
  if (!untranslatedSay) throw new Error(`Find dev says, but not find the say item for unstranslated label ${unstranslatedLabel.labelId}`);

  const untranslatedResponses = unstranslatedLabel.responses.get('dev');
  if (!untranslatedResponses) throw new Error(`Cannot find dev responses for unstranslated label ${unstranslatedLabel.labelId}`);
};

const translateNpcDialogue = <T>(untranslatedNpcDialogue: UntranslatedNpcDialogue<T>, language: GameLanguage): { label: LabelFunction<T> } => {
  let _unstranslatedLabel: Maybe<UntranslatedLabel<T>> = null;
  let _label: Maybe<Label<T>> = null;
  const npcDialogue: NpcDialogue<T> = {
    tree: new Map<LabelId, Label<T>>(),
    constructorsWeights: untranslatedNpcDialogue.constructorsWeights,
  };

  const label: LabelFunction<T> = (labelId) => {
    _unstranslatedLabel = untranslatedNpcDialogue.tree.get(labelId)!;
    throwIfInvalidUntranslatedLabel(_unstranslatedLabel, labelId);

    const isFirstRun = !_label;
    if (!isFirstRun) {
      done();
    }

    _label = {
      labelId: _unstranslatedLabel.labelId,
      args: _unstranslatedLabel.args,
      says: new Map<GameLanguage, Say<T>[]>(),
      responses: new Map<GameLanguage, Response<T>[]>(),
      jump: _unstranslatedLabel.jump,
    };

    _label.says.set(language, []);
    _label.responses.set(language, []);

    return {
      say,
    };
  };

  const say: SayFunction<T> = (who: NpcId, what: string) => {
    const untranslatedSays = _unstranslatedLabel!.says.get('dev')!;
    const untranslatedSay = untranslatedSays[0]!;
    const says = _label!.says.get(language)!;

    const isFirstSay = says.length === 0;
    says.push({
      sayId: createSayId(_label!.labelId, says.length),
      args: isFirstSay ? untranslatedSay.args : null,
      who,
      what,
    });

    return {
      say,
      response,
    };
  };

  const response: ResponseFunction<T> = (responseId: string, what: string) => {
    const untranslatedResponses = _unstranslatedLabel!.responses.get('dev')!;
    const untranslatedResponse = untranslatedResponses.find(x => x.responseId === responseId)!;
    if (!untranslatedResponse) throw new Error(`Response ${responseId} does not exist on label ${_unstranslatedLabel!.labelId}`);

    _label!.responses.get(language)!.push({
      responseId,
      args: untranslatedResponse.args,
      jumpTo: untranslatedResponse.jumpTo,
      what,
    });

    return {
      response,
      label,
      done,
    };
  };

  const done: DoneFunction<T> = () => {
    /*
         * builer guarantees that:
         * - labelId is set
         * - at least one SayItem is set
         * - at least one responseItem or JumpItem is set
         */
    const l = just(_label);
    npcDialogue.tree.set(l.labelId, { ...l });

    return npcDialogue;
  };

  return {
    label,
  };
};

export default translateNpcDialogue;
