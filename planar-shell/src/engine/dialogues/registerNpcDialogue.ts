import { just } from "@/shared/maybe";
import { createSayId } from "./types";

import type { Maybe } from "@/shared/maybe";
import type { Lang } from "@/shared/lang";
import type { LabelId, ResponseId } from "./enums";
import type {
    ArgsProps,
    UntranslatedNpcDialogue,
    UntranslatedLabel,
    UntranslatedSay,
    UntranslatedResponse,
    UntranslatedJump,
} from "./types";


type LabelFunction<T> = (labelId: LabelId, args?: Maybe<ArgsProps<T>>) => Readonly<{ say: SayFunction<T>; }>;
type SayFunction<T> = (args: Maybe<ArgsProps<T>>) => Readonly<{ say: SayFunction<T>; response: ResponseFunction<T>; jump: JumpFunction<T>; }>;
type ResponseFunction<T> = (responseId: ResponseId, jumpTo: LabelId, args: Maybe<ArgsProps<T>>) => Readonly<{ response: ResponseFunction<T>; label: LabelFunction<T>; done: DoneFunction<T>; }>;
type JumpFunction<T> = (labelId: LabelId, args?: Maybe<ArgsProps<T>>) => Readonly<{ label: LabelFunction<T>; done: DoneFunction<T>; }>;
type DoneFunction<T> = () => UntranslatedNpcDialogue<T>;


const registerNpcDialogue = <T>(): { label: LabelFunction<T> } => {
    let _label: Maybe<UntranslatedLabel<T>> = null;
    let _jumpTo: Maybe<UntranslatedJump<T>> = null;
    let npcDialogue: UntranslatedNpcDialogue<T> = {
        tree: new Map<LabelId, UntranslatedLabel<T>>(),
        constructorsWeights: new Map<LabelId, number>(),
    }

    const label: LabelFunction<T> = (labelId: LabelId, args?: Maybe<ArgsProps<T>>) => {
        const alreadyRegistrated = npcDialogue.tree.get(labelId);
        if (alreadyRegistrated) throw new Error(`Label ${labelId} already registrated.`);

        const hasCondition = !!args?.onlyIf;
        const hasWeight = !!args?.weight;
        const hasOnlyWeight = !hasCondition && hasWeight;
        const hasOnlyCondition = hasCondition && !hasWeight
        if (hasOnlyWeight || hasOnlyCondition) throw new Error(`To register label ${labelId} as a constructor with weight, add a onlyIf condition and optional weight to the label args`);

        const isFirstRun = !_label;
        if (!isFirstRun) {
            done();
        }

        _label = {
            labelId: labelId,
            args: args,
            says: new Map<Lang, UntranslatedSay<T>[]>(),
            responses: new Map<Lang, UntranslatedResponse<T>[]>(),
            jump: null,
        }

        _label.says.set('dev', []);
        _label.responses.set('dev', []);

        return {
            say,
        }
    };
    const say: SayFunction<T> = (args: Maybe<ArgsProps<T>>) => {
        const s = _label!.says.get('dev')!;
        s.push({
            sayId: createSayId(_label!.labelId!, s.length),
            args,
        });

        return {
            say,
            response,
            jump,
        }
    };
    const response: ResponseFunction<T> = (
        responseId: string,
        jumpTo: LabelId,
        args: Maybe<ArgsProps<T>>
    ) => {
        _label!.responses.get('dev')!.push({
            responseId,
            jumpTo,
            args,
        });

        return {
            response,
            label,
            done,
        }
    };
    const jump: JumpFunction<T> = (jumpTo: LabelId, args?: Maybe<ArgsProps<T>>) => {
        _jumpTo = {
            jumpTo,
            args,
        }
        return {
            label,
            done,
        }
    };
    const done: DoneFunction<T> = () => {
        /*
         * builer guarantees that:
         * - labelId is set
         * - at least one SayItem is set
         * - at least one responseItem or JumpItem is set
         */
        const l = just(_label);
        npcDialogue.tree.set(l.labelId, {
            labelId: l.labelId,
            args: l.args,
            says: l.says,
            responses: l.responses,
            jump: _jumpTo,
        });

        const hasCondition = !!l.args?.onlyIf;
        const hasWeight = !!l.args?.weight;
        const weighted = hasCondition && hasWeight;
        if (weighted) npcDialogue.constructorsWeights.set(l.labelId, l.args!.weight!);

        return npcDialogue;
    }

    return {
        label,
    }
}

export default registerNpcDialogue;
