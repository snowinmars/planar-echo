import createWriter from '@/shared/writer.js';
import { just } from '@planar/shared';

import type { NestedDlg } from './4.nestDialogue.types.js';
import type { GameLanguage } from '@planar/shared';
import type { GhostCreatureV10, GhostCreatureV12, GhostCreatureV22, GhostCreatureV90 } from '../../types.js';

type GhostCreature = GhostCreatureV10 | GhostCreatureV12 | GhostCreatureV22 | GhostCreatureV90;

const formState = (npcLowercaseId: string, stateIndex: number): string => `${npcLowercaseId}_state${stateIndex}`;
const formResponse = (npcLowercaseId: string, responseIndex: number): string => `${npcLowercaseId}_response${responseIndex}`;

const escape = (x: string): string => {
  const json = JSON.stringify(x);
  return '\'' + json.slice(1, -1).replaceAll('\'', '\\\'') + '\'';
};

type TranslateDialogueProps = Readonly<{
  dlg: NestedDlg;
  npcId: string;
  language: GameLanguage;
}>;
const translateDialogue = ({
  dlg,
  npcId,
  language,
}: TranslateDialogueProps): string => {
  const npcLowercaseId = dlg.resourceName.split('.')[0]!;
  // const npcUppercaseId = npcLowercaseId[0]!.toUpperCase() + npcLowercaseId.slice(1);

  const writer = createWriter();
  writer.writeLine(`import translateNpcDialogue from './_translateNpcDialogue.js';`);
  writer.writeLine(`import type { UntranslatedNpcDialogue } from './_types.js';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${dlg.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const ${npcLowercaseId}Dialogue = <T>(${npcLowercaseId}DialogueSkeleton: UntranslatedNpcDialogue<T>) => translateNpcDialogue(${npcLowercaseId}DialogueSkeleton, '${language}')`);

  for (const state of dlg.states) {
    const stateId = formState(npcLowercaseId, state.index);

    writer.writeLine(`.label('${stateId}')`, 2);
    writer.writeLine(`.say('${npcId}', ${escape(just(state.textTlk))})`, 2);

    for (const response of state.responses) {
      const responseId = formResponse(npcLowercaseId, response.index);
      // sometimes there are empty responses, like bannah.dgl > response 0
      // i just skip them right now
      // TODO [snow]: do something about it.
      if (response.textTlk) writer.writeLine(`.response('${responseId}', ${escape(response.textTlk)})`, 2);
      else writer.writeLine(`.response('${responseId}', '...')`, 2);
    }

    writer.br();
  }

  writer.writeLine('.done();', 2);

  return writer.done();
};

export default translateDialogue;
