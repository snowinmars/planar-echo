import { just } from "@/shared/maybe";
import { createSayId } from "./types";

import type { Maybe } from "@/shared/maybe";
import type { Lang } from "@/shared/lang";
import type { LabelId, NpcId, ResponseId } from "./enums";
import type {
    NpcDialogue,
    Label,
    Say,
    Response,
    UntranslatedNpcDialogue,
    UntranslatedLabel,
} from "./types";


type LabelFunction<T> = (labelId: LabelId) => Readonly<{ say: SayFunction<T>; }>;
type SayFunction<T> = (who: NpcId, what: string) => Readonly<{ say: SayFunction<T>; response: ResponseFunction<T>; }>;
type ResponseFunction<T> = (responseId: ResponseId, what: string) => Readonly<{ response: ResponseFunction<T>; label: LabelFunction<T>; done: DoneFunction<T>; }>;
type DoneFunction<T> = () => NpcDialogue<T>;

const throwIfInvalidUntranslatedLabel = <T>(unstranslatedLabel: UntranslatedLabel<T>, labelId: LabelId): void => {
    if (!unstranslatedLabel) throw new Error(`Label ${labelId} was not registrated.`);

    const untranslatedSays = unstranslatedLabel.says.get('dev')
    if (!untranslatedSays) throw new Error(`Cannot find dev says for unstranslated label ${unstranslatedLabel!.labelId}`);
    if (untranslatedSays.length !== 1) throw new Error(`Wrong dev says count for unstranslated label ${unstranslatedLabel!.labelId}: expect 1 but got ${untranslatedSays.length}`);

    const untranslatedSay = untranslatedSays[0]!;
    if (!untranslatedSay) throw new Error(`Find dev says, but not find the say item for unstranslated label ${unstranslatedLabel!.labelId}`);

    const untranslatedResponses = unstranslatedLabel.responses.get('dev')
    if (!untranslatedResponses) throw new Error(`Cannot find dev responses for unstranslated label ${unstranslatedLabel!.labelId}`);
}

const translateNpcDialogue = <T>(untranslatedNpcDialogue: UntranslatedNpcDialogue<T>, lang: Lang): { label: LabelFunction<T> } => {
    let _unstranslatedLabel: Maybe<UntranslatedLabel<T>> = null;
    let _label: Maybe<Label<T>> = null;
    let npcDialogue: NpcDialogue<T> = {
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
            says: new Map<Lang, Say<T>[]>(),
            responses: new Map<Lang, Response<T>[]>(),
            jump: _unstranslatedLabel.jump,
        };

        _label.says.set(lang, []);
        _label.responses.set(lang, []);

        return {
            say,
        }
    }

    const say: SayFunction<T> = (who: NpcId, what: string) => {
        const untranslatedSays = _unstranslatedLabel!.says.get('dev')!;
        const untranslatedSay = untranslatedSays[0]!;
        const says = _label!.says.get(lang)!;

        const isFirstSay = says.length === 0;
        says.push({
            sayId: createSayId(_label!.labelId, says.length),
            args: isFirstSay ? untranslatedSay.args : null,
            who,
            what
        });

        return {
            say,
            response,
        }
    }

    const response: ResponseFunction<T> = (responseId: string, what: string) => {
        const untranslatedResponses = _unstranslatedLabel!.responses.get('dev')!;
        const untranslatedResponse = untranslatedResponses.find(x => x.responseId === responseId)!;
        if (!untranslatedResponse) throw new Error(`Response ${responseId} does not exist on label ${_unstranslatedLabel!.labelId}`);

        _label!.responses.get(lang)!.push({
            responseId,
            args: untranslatedResponse.args,
            jumpTo: untranslatedResponse.jumpTo,
            what,
        })

        return {
            response,
            label,
            done,
        }
    }

    const done: DoneFunction<T> = () => {
        /*
         * builer guarantees that:
         * - labelId is set
         * - at least one SayItem is set
         * - at least one responseItem or JumpItem is set
         */
        const l = just(_label)
        npcDialogue.tree.set(l.labelId, { ...l });

        return npcDialogue;
    }

    return {
        label,
    }
}

export default translateNpcDialogue;
