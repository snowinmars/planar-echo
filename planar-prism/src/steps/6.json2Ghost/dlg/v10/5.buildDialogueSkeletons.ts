import createWriter from '@/shared/writer.js';
import { just, nothing } from '@planar/shared';
import ie2ts from './ie2ts/index.js';

import type { Maybe } from '@planar/shared';
import type { NestedDlg, NestedDlgResponse, NestedDlgState } from './4.nestDialogue.types.js';

const isResponseDesctructor = (response: NestedDlgResponse) => !response.nextDialog;
const isResponseExtern = (response: NestedDlgResponse, resourceName: string) => response.nextDialog && `${response.nextDialog}.dlg` !== resourceName;

const formStateId = (npcLowercaseId: string, stateIndex: number): string => `${npcLowercaseId}_state${stateIndex}`;
const formResponseId = (npcLowercaseId: string, responseIndex: number): string => `${npcLowercaseId}_response${responseIndex}`;

// const wrapWithQuotes = (str: string, v: string): string => str.replaceAll(RegExp(`([(,])${v}([,)])`, 'g'), `$1'${v}'$2`);
// const fixSyntax = (str: string): string => {
//   let x = str
//     .replaceAll(`'`, `\\'`)
//     .replaceAll(`"`, `'`);
//   x = wrapWithQuotes(x, 'protagonist');
//   x = wrapWithQuotes(x, 'myself');
//   x = wrapWithQuotes(x, 'portal_cursor_visible');
//   x = wrapWithQuotes(x, 'portal_enabled');
//   x = wrapWithQuotes(x, 'two_ai_seconds');
//   x = wrapWithQuotes(x, 'default');
//   x = x
//     .replaceAll(/([(,])(lawful|chaotic|neutral)_(good|evil|neutral)([,)])/g, `$1'$2_$3'$4`)
//     .replaceAll(/,(anim_[a-z0-9]*?)([^a-z0-9])/g, `,'$1'$2`);
//   return x;
// };

const formTrigger = (triggerText: string, offset: number): string => {
  const spaces = ' '.repeat(offset);
  // const fixed = fixSyntax(triggerText);
  const parts = triggerText.split('\n');
  const tsLikeSyntax = parts.map(x => x.startsWith('!') ? '!l.' + x.slice(1) : 'l.' + x).join(` &&\n${spaces}`);

  return ie2ts(tsLikeSyntax);
};

const formAction = (actionText: string, offset: number): string => {
  const spaces = ' '.repeat(offset);
  // const fixed = fixSyntax(actionText);
  const parts = actionText.split('\n');
  const tsLikeSyntax = parts.map(x => x.startsWith('!') ? '!l.' + x.slice(1) : 'l.' + x).join(`;\n${spaces}`);

  return ie2ts(tsLikeSyntax);
};

const formLabelArgsProps = (state: NestedDlgState, weight: number): Maybe<string> => {
  const isCtor = weight !== -1;
  const hasAction = !!state.action;
  if (!isCtor && !hasAction) return nothing();

  const writer = createWriter();

  if (isCtor) {
    const hasTrigger = !!state.trigger;
    if (hasTrigger) {
      writer.writeLine(`weight: ${weight},`, 4)
        .writeLine(`onlyIf: (l) => { // trigger index ${state.trigger.index}`, 4)
        .writeLine(`return ${formTrigger(state.trigger.text, 13)};`, 6)
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
}>;
const formStateLabel = ({
  stateId,
  stateIndicesOrderedByWeight,
  state,
}: FormStateProps): string => {
  const writer = createWriter();

  const weight = stateIndicesOrderedByWeight.indexOf(state.index);
  const labelArgsProps = formLabelArgsProps(state, weight);
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

const formResponseActionArgsProps = (response: NestedDlgResponse): Maybe<string> => {
  const hasAction = !!response.action;
  const hasTrigger = !!response.trigger;
  const hasJournal = !!response.journalTlk;
  if (!hasAction && !hasTrigger && !hasJournal) return nothing();

  const writer = createWriter();

  if (hasAction || hasJournal) {
    writer.writeLine('onEnter: (l) => {', 4);
    if (hasAction) writer.writeLine(`${formAction(response.action.text, 6)};`, 6);
    if (hasJournal) writer.writeLine(`l.journal('${response.journalId!}');`, 6);
    writer.writeLine('},', 4);
  }

  if (hasTrigger) writer
    .writeLine('onlyIf: (l) => {', 4)
    .writeLine(`return ${formTrigger(response.trigger.text, 6)};`, 6)
    .writeLine('},', 4);

  return writer.done();
};

type FormResponseProps = Readonly<{
  response: NestedDlgResponse;
  responseId: string;
  targetState: string;
  resourceName: string;
  npcLowercaseId: string;
}>;

const formResponse = ({
  response,
  responseId,
  targetState,
  resourceName,
  npcLowercaseId,
}: FormResponseProps): string => {
  const writer = createWriter();
  const responseActionArgsProps = formResponseActionArgsProps(response);
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

const buildDialogueSkeleton = (dlg: NestedDlg): string => {
  const npcLowercaseId = dlg.resourceName.split('.')[0]!;
  const npcUppercaseId = npcLowercaseId[0]!.toUpperCase() + npcLowercaseId.slice(1);

  const writer = createWriter();
  writer.writeLine(`import registerNpcDialogue from './_registerNpcDialogue.js';`);
  writer.writeLine(`import type { ${npcUppercaseId}Logic } from './${dlg.resourceName}.types.js';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${dlg.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const ${npcLowercaseId}DialogueSkeleton = registerNpcDialogue<${npcUppercaseId}Logic>()`);

  for (const state of dlg.states) {
    const stateId = formStateId(npcLowercaseId, state.index);
    writer.write(formStateLabel({
      stateId,
      stateIndicesOrderedByWeight: dlg.stateIndicesOrderedByWeight,
      state,
    }));

    writer.writeLine('.say()', 2);

    for (const response of state.responses) {
      const responseId = formResponseId(npcLowercaseId, response.index);
      const targetState = response.flags.includes('terminates dialog')
        ? 'terminate dialogue'
        : formStateId(just(response.nextDialog), just(response.nextDialogState));

      writer.write(formResponse({
        response,
        responseId,
        targetState,
        resourceName: dlg.resourceName,
        npcLowercaseId,
      }));
    }

    writer.br();
  }

  writer.writeLine('.done();');

  return writer.done();
};

export default buildDialogueSkeleton;
