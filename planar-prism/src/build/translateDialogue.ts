import createWriter from '../shared/writer.js';
import type { NpcDialogue } from '../pipes/convertDlg/types.js';
import type { NpcDialogueEcho } from './buildDialogueSkeletonsTypes.js';
import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from 'src/pipes/convertCre/patches/readCreatureBufferTypes.js';

type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;

const formState = (npcLowercaseId: string, stateIndex: number): string => `${npcLowercaseId}_state${stateIndex}`;
const formResponse = (npcLowercaseId: string, stateIndex: number, responseIndex: number): string => `${formState(npcLowercaseId, stateIndex)}_response${responseIndex}`;

const escape = (x: string): string => {
  const json = JSON.stringify(x);
  return '\'' + json.slice(1, -1).replaceAll('\'', '\\\'') + '\'';
};

const translateDialogue = (
  npcDialogue: NpcDialogue,
  creature: Creature,
  language: string,
): string => {
  const npcLowercaseId = npcDialogue.resourceName.split('.')[0]!;
  // const npcUppercaseId = npcLowercaseId[0]!.toUpperCase() + npcLowercaseId.slice(1);

  const writer = createWriter();
  writer.writeLine(`const ${npcLowercaseId}Dialogue = translateNpcDialogue(${npcLowercaseId}DialogueSkeleton, '${language}')`);

  for (const state of npcDialogue.states) {
    const stateId = formState(npcLowercaseId, state.index);

    writer.writeLine(`.label('${stateId}')`, 2);
    writer.writeLine(`.say('${creature.header.longName}', ${escape(state.text)})`, 2);

    for (const response of state.responses) {
      const responseId = formResponse(npcLowercaseId, state.index, response.index);
      writer.writeLine(`.response('${responseId}', ${escape(response.text)})`, 2);
    }

    writer.br();
  }

  writer.writeLine('.done();', 2);

  return writer.done();
};

const detectCreatureForDialogue = (dialogueResourceName: string): string => {
  switch (dialogueResourceName) {
    case 'dmorte.dlg': return 'morte.cre';
    case 'dmorte1.dlg': return 'morte.cre';
    case 'dmorte2.dlg': return 'morte.cre';
    default: throw new Error(`Cannot detect creature for dialogue '${dialogueResourceName}'`);
  }
};

const translateDialogues = (
  npcDialogues: NpcDialogue[],
  creatures: Creature[],
  language: string,
  percentCallback: ((percent: number, resource: string) => void) | null = null,
): NpcDialogueEcho[] => {
  const npcDialogueEchoes: NpcDialogueEcho[] = [];
  let i = 0;

  for (const npcDialogue of npcDialogues) {
    const creatureResourceName = detectCreatureForDialogue(npcDialogue.resourceName);
    const creature = creatures.find(x => x.resourceName == creatureResourceName)!;
    const npcDialogueEcho = translateDialogue(npcDialogue, creature, language);

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

export default translateDialogues;
