import createWriter from '@/shared/writer.js';
import { just, nothing } from '@planar/shared';
import ie2ts from './ie2ts/index.js';

import type { Maybe } from '@planar/shared';
import type { NestedDlg, NestedDlgResponse, NestedDlgState } from './4.nestDialogue.types.js';
import type { DiscoverNext } from '@/discoverer.types.js';

const isResponseDesctructor = (response: NestedDlgResponse) => !response.nextDialog;
const isResponseExtern = (response: NestedDlgResponse, resourceName: string) => response.nextDialog && `${response.nextDialog}.dlg` !== resourceName;

const formStateId = (npcLowercaseId: string, stateIndex: number): string => `${npcLowercaseId}_state${stateIndex}`.replace(`'`, `\\'`);
const formResponseId = (npcLowercaseId: string, responseIndex: number): string => `${npcLowercaseId}_response${responseIndex}`;

// from: [ 'A', 'B', 'l.or(2)', 'C', 'D', 'E', 'l.or(2)', 'F', 'G', 'H' ]
// to  : [ 'A', 'B', '( C || D )'       , 'E', '( F || G )'       , 'H' ]
const collapseOperatorOr = (parts: string[], spaces: string): string[] => {
  if (parts.length <= 2) return parts;

  const result: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const hasOr = parts[i]!.startsWith('l.or(');
    if (!hasOr) {
      result.push(parts[i]!);
      continue;
    };
    const or = parts[i]!;
    const orCount = parseInt(/or\((\d+)\)/.exec(or)![1]!);
    const ored = parts.slice(i + 1, i + 1 + orCount);
    result.push(`(\n  ${spaces}` + ored.join(` ||\n  ${spaces}`) + `\n${spaces})`);
    i += orCount;
  }
  return result;
};

const formTrigger = (triggerText: string, offset: number, npcLowercaseId: string, discover: DiscoverNext): string => {
  const spaces = ' '.repeat(offset);
  // const fixed = fixSyntax(triggerText);
  const parts = triggerText.split('\n');
  const tsLikeParts = parts.map(x => x.startsWith('!') ? '!l.' + x.slice(1) : 'l.' + x).map(x => ie2ts(x, npcLowercaseId, discover));
  const tsLikeSyntax = collapseOperatorOr(tsLikeParts, spaces).join(` &&\n${spaces}`);

  return tsLikeSyntax;
};

const formAction = (actionText: string, offset: number, npcLowercaseId: string, discover: DiscoverNext): string => {
  const spaces = ' '.repeat(offset);
  // const fixed = fixSyntax(actionText);
  const parts = actionText.split('\n');
  const tsLikeSyntax = parts.map(x => x.startsWith('!') ? '!l.' + x.slice(1) : 'l.' + x).map(x => ie2ts(x, npcLowercaseId, discover)).join(`;\n${spaces}`);

  return tsLikeSyntax;
};

const formLabelArgsProps = (state: NestedDlgState, weight: number, npcLowercaseId: string, discover: DiscoverNext): Maybe<string> => {
  const isCtor = weight !== -1;
  const hasAction = !!state.action;
  if (!isCtor && !hasAction) return nothing();

  const writer = createWriter();

  if (isCtor) {
    const hasTrigger = !!state.trigger;
    if (hasTrigger) {
      writer.writeLine(`weight: ${weight},`, 4)
        .writeLine(`onlyIf: (l) => { // trigger index ${state.trigger.index}`, 4)
        .writeLine(`return ${formTrigger(state.trigger.text, 13, npcLowercaseId, discover)};`, 6)
        .writeLine('},', 4);
    }
    else {
      writer.writeLine(`weight: ${weight},`, 4)
        .writeLine(`onlyIf: (l) => { // trigger index unknown`, 4)
        .writeLine('return true;', 6)
        .writeLine('},', 4);
    }
  }

  if (hasAction) {
    writer.writeLine('onEnter: (l) => {', 4);
    writer.write(state.action);
    writer.writeLine('},', 4);
  }

  return writer.done();
};

type FormStateProps = Readonly<{
  stateId: string;
  stateIndicesOrderedByWeight: number[];
  state: NestedDlgState;
  npcLowercaseId: string;
  discover: DiscoverNext;
}>;
const formStateLabel = ({
  stateId,
  stateIndicesOrderedByWeight,
  state,
  npcLowercaseId,
  discover,
}: FormStateProps): string => {
  const writer = createWriter();

  const weight = stateIndicesOrderedByWeight.indexOf(state.index);
  const labelArgsProps = formLabelArgsProps(state, weight, npcLowercaseId, discover);
  const hasLabelArgsProps = !!labelArgsProps;
  if (hasLabelArgsProps) {
    writer.writeLine(`.label('${stateId}', {`, 2);
    writer.write(just(labelArgsProps));
    writer.writeLine('})', 2);
  }
  else {
    writer.writeLine(`.label('${stateId}')`, 2);
  }

  return writer.done();
};

const formResponseActionArgsProps = (response: NestedDlgResponse, npcLowercaseId: string, discover: DiscoverNext): Maybe<string> => {
  const hasAction = !!response.action;
  const hasTrigger = !!response.trigger;
  const hasJournal = !!response.journalTlk;
  if (!hasAction && !hasTrigger && !hasJournal) return nothing();

  const writer = createWriter();

  if (hasAction || hasJournal) {
    writer.writeLine('onEnter: (l) => {', 4);
    if (hasAction) writer.writeLine(`${formAction(response.action.text, 6, npcLowercaseId, discover)};`, 6);
    if (hasJournal) {
      writer.writeLine(`l.setJournal('${response.journalId!}');`, 6);
      discover({ type: 'journal', name: just(response.journalId).toString() });
    }
    writer.writeLine('},', 4);
  }

  if (hasTrigger) writer
    .writeLine('onlyIf: (l) => {', 4)
    .writeLine(`return ${formTrigger(response.trigger.text, 6, npcLowercaseId, discover)};`, 6)
    .writeLine('},', 4);

  return writer.done();
};

type FormResponseProps = Readonly<{
  response: NestedDlgResponse;
  responseId: string;
  targetState: string;
  resourceName: string;
  npcLowercaseId: string;
  discover: DiscoverNext;
}>;

const formResponse = ({
  response,
  responseId,
  targetState,
  resourceName,
  npcLowercaseId,
  discover,
}: FormResponseProps): string => {
  const writer = createWriter();
  const responseActionArgsProps = formResponseActionArgsProps(response, npcLowercaseId, discover);
  const isDestructor = isResponseDesctructor(response);
  const isExtern = isResponseExtern(response, resourceName);

  const hasReponseArgsProps = !!responseActionArgsProps;
  if (hasReponseArgsProps) {
    /* eslint-disable @stylistic/no-multi-spaces */
    if (isDestructor)  writer.writeLine(`.response('${responseId}', '${npcLowercaseId}_desctuctor', {`, 2);
    else if (isExtern) writer.writeLine(`.response('${responseId}', '${targetState}', { // extern`, 2);
    else               writer.writeLine(`.response('${responseId}', '${targetState}', {`, 2);
    /* eslint-enable */

    writer.write(just(responseActionArgsProps));

    writer.writeLine('})', 2);
  }
  else {
    /* eslint-disable @stylistic/no-multi-spaces */
    if (isDestructor)  writer.writeLine(`.response('${responseId}', '${npcLowercaseId}_desctuctor')`, 2);
    else if (isExtern) writer.writeLine(`.response('${responseId}', '${targetState}') // extern`, 2);
    else               writer.writeLine(`.response('${responseId}', '${targetState}')`, 2);
    /* eslint-enable */
  }

  return writer.done();
};

const buildDialogueSkeleton = (dlg: NestedDlg, discover: DiscoverNext): string => {
  const npcLowercaseId = dlg.resourceName.split('.')[0]!.replace(`'`, ``);

  const writer = createWriter();
  writer.writeLine(`import registerNpcDialogue from './_registerNpcDialogue.js';`);
  writer.writeLine(`import type { DialogueLogic } from './_dialogueLogic.js';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${dlg.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const ${npcLowercaseId}DialogueSkeleton = registerNpcDialogue<DialogueLogic>()`);

  for (const state of dlg.states) {
    const stateId = formStateId(npcLowercaseId, state.index);
    discover({ type: 'state', name: stateId });
    writer.write(formStateLabel({
      stateId,
      stateIndicesOrderedByWeight: dlg.stateIndicesOrderedByWeight,
      state,
      npcLowercaseId,
      discover,
    }));

    writer.writeLine('.say()', 2);

    for (const response of state.responses) {
      const responseId = formResponseId(npcLowercaseId, response.index);
      discover({ type: 'response', name: responseId });
      const targetState = response.flags.includes('terminates dialog')
        ? 'terminate dialogue'
        : formStateId(just(response.nextDialog), just(response.nextDialogState));

      writer.write(formResponse({
        response,
        responseId,
        targetState,
        resourceName: dlg.resourceName,
        npcLowercaseId,
        discover,
      }));
    }

    writer.br();
  }

  writer.writeLine('.done();');
  writer.br();
  writer.writeLine(`export default ${npcLowercaseId}DialogueSkeleton`);

  return writer.done();
};

export default buildDialogueSkeleton;
