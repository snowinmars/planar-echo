import createWriter from '@/shared/writer.js';
import { just } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { DlgResponse } from '@/steps/4.biffs2json/dlg/v1.types/3.response.js';
import type { DlgState } from '@/steps/4.biffs2json/dlg/v1.types/2.states.js';
import type { Dlg } from '@/steps/4.biffs2json/dlg/types.js';
import type { NpcDialogueEcho } from './buildDialogueSkeletonsTypes.js';

const isResponseDesctructor = (response: DlgResponse) => !response.nextDialog;
const isResponseExtern = (response: DlgResponse, resourceName: string) => `${just(response.nextDialog)}.dlg` !== resourceName;

const formState = (npcLowercaseId: string, stateIndex: number): string => `${npcLowercaseId}_state${stateIndex}`;
const formResponse = (npcLowercaseId: string, stateIndex: number, responseIndex: number): string => `${formState(npcLowercaseId, stateIndex)}_response${responseIndex}`;

const formTrigger = (triggerText: string, offset: number): string => {
  const x = ' '.repeat(offset);
  return triggerText.replaceAll('\n', ' &&\n' + x);
};
const formAction = (actionText: string, offset: number): string => {
  const x = ' '.repeat(offset);
  return actionText.replaceAll('\n', ';\n' + x);
};

const formLabelArgsProps = (state: DlgState, weight: number): Maybe<string> => {
  const isCtor = weight !== -1;
  const hasAction = !!state.action;
  if (!isCtor && !hasAction) return null;

  const writer = createWriter();

  if (isCtor) {
    const hasTrigger = !!state.trigger;
    if (!hasTrigger) throw new Error(`Why do you want to formLabelArgsProps for state ${state.index} has no trigger?`);

    writer.writeLine(`weight: ${weight},`, 4)
      .writeLine(`onlyIf: (l) => { // trigger index ${state.trigger.index}`, 4)
      .writeLine(`return ${formTrigger(state.trigger.text, 13)};`, 6)
      .writeLine('},', 4);
  }

  if (hasAction) {
    writer.writeLine('onEnter: (l) => {', 4);
    writer.write(state.action);
    writer.writeLine('},', 4);
  }

  return writer.done();
};

const formResponseActionArgsProps = (response: DlgResponse): string => {
  const hasAction = !!response.action;
  if (!hasAction) throw new Error(`Why do you want to formResponseActionArgsProps for response '${response.index}', that has no action?`);

  return createWriter()
    .writeLine('onEnter: (l) => {', 4)
    .write(formAction(response.action.text, 6), 6)
    .writeLine(';')
    .writeLine('},', 4)
    .done();
};

const buildDialogueSkeleton = (npcDialogue: Dlg): string => {
  const npcLowercaseId = npcDialogue.resourceName.split('.')[0]!;
  const npcUppercaseId = npcLowercaseId[0]!.toUpperCase() + npcLowercaseId.slice(1);

  const writer = createWriter();
  writer.writeLine(`const ${npcLowercaseId}DialogueSkeleton = registerNpcDialogue<${npcUppercaseId}Logic>()`);

  for (const state of npcDialogue.states) {
    const stateId = formState(npcLowercaseId, state.index);

    const weight = npcDialogue.stateIndicesOrderedByWeight.indexOf(state.index);
    const labelArgsProps = formLabelArgsProps(state, weight);
    const haslabelArgsProps = !!labelArgsProps;
    if (haslabelArgsProps) {
      writer.writeLine(`.label('${stateId}', {`, 2);
      writer.write(just(labelArgsProps));
      writer.writeLine('})', 2);
    }
    else {
      writer.writeLine(`.label('${stateId}')`, 2);
    }

    writer.writeLine('.say()', 2);

    for (const response of state.responses) {
      const responseId = formResponse(npcLowercaseId, state.index, response.index);
      const targetState = formState(just(response.nextDialog), just(response.nextDialogState));

      const hasAction = !!response.action;
      if (hasAction) {
        const responseActionArgsProps = formResponseActionArgsProps(response);
        const isDestructor = isResponseDesctructor(response);
        const isExtern = isResponseExtern(response, npcDialogue.resourceName);

        if (isDestructor) {
          writer.writeLine(`.response('${responseId}', '${npcLowercaseId}_desctuctor', {`, 2);
          writer.write(responseActionArgsProps);
          writer.writeLine('})', 2);
          continue;
        }
        else if (isExtern) {
          writer.writeLine(`.response('${responseId}', '${targetState}', { // extern`, 2);
          writer.write(responseActionArgsProps);
          writer.writeLine('})', 2);
        }
        else {
          writer.writeLine(`.response('${responseId}', '${targetState}', {`, 2);
          writer.write(responseActionArgsProps);
          writer.writeLine('})', 2);
        }
      }
      else {
        const isDestructor = isResponseDesctructor(response);
        const isExtern = isResponseExtern(response, npcDialogue.resourceName);

        if (isDestructor) {
          writer.writeLine(`.response('${responseId}', '${npcLowercaseId}_desctuctor')`, 2);
        }
        else if (isExtern) {
          writer.writeLine(`.response('${responseId}', '${targetState}') // extern`, 2);
        }
        else {
          writer.writeLine(`.response('${responseId}', '${targetState}')`, 2);
        }
      }
    }

    writer.br();
  }

  writer.writeLine('.done();');

  return writer.done();
};

const buildDialogueSkeletons = (
  npcDialogues: Dlg[],
  percentCallback: ((percent: number, resource: string) => void) | null = null,
): NpcDialogueEcho[] => {
  const npcDialogueEchoes: NpcDialogueEcho[] = [];
  let i = 0;

  for (const npcDialogue of npcDialogues) {
    const npcDialogueEcho = buildDialogueSkeleton(npcDialogue);

    npcDialogueEchoes.push({
      resourceName: npcDialogue.resourceName,
      content: npcDialogueEcho,
    });

    const percent = Math.round((i + 1) * 100 / npcDialogues.length);
    percentCallback?.(percent, npcDialogue.resourceName);
    i++;
  }

  return npcDialogueEchoes;
};

export default buildDialogueSkeletons;
