// import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from 'src/steps/4.biffs2json/cre/types.js';
// import createWriter from '../shared/writer.js';
// import type { NpcDialogueEcho } from './buildDialogueSkeletonsTypes.js';
// import type { Dlg } from 'src/steps/4.biffs2json/dlg/types.js';

// type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;

// const formState = (npcLowercaseId: string, stateIndex: number): string => `${npcLowercaseId}_state${stateIndex}`;
// const formResponse = (npcLowercaseId: string, stateIndex: number, responseIndex: number): string => `${formState(npcLowercaseId, stateIndex)}_response${responseIndex}`;

// const escape = (x: string): string => {
//   const json = JSON.stringify(x);
//   return '\'' + json.slice(1, -1).replaceAll('\'', '\\\'') + '\'';
// };

// const translateDialogue = (
//   npcDialogue: Dlg,
//   creature: Creature,
//   language: string,
// ): string => {
//   const npcLowercaseId = npcDialogue.resourceName.split('.')[0]!;
//   // const npcUppercaseId = npcLowercaseId[0]!.toUpperCase() + npcLowercaseId.slice(1);

//   const writer = createWriter();
//   writer.writeLine(`const ${npcLowercaseId}Dialogue = translateNpcDialogue(${npcLowercaseId}DialogueSkeleton, '${language}')`);

//   for (const state of npcDialogue.states) {
//     const stateId = formState(npcLowercaseId, state.index);

//     writer.writeLine(`.label('${stateId}')`, 2);
//     writer.writeLine(`.say('${creature.header.longNameTlk!.text}', ${escape(state.textTlk!.text)})`, 2);

//     for (const response of state.responses) {
//       const responseId = formResponse(npcLowercaseId, state.index, response.index);
//       writer.writeLine(`.response('${responseId}', ${escape(response.textTlk!.text)})`, 2);
//     }

//     writer.br();
//   }

//   writer.writeLine('.done();', 2);

//   return writer.done();
// };

// const createDialogueCreatureMap = (creatures: Creature[]): Map<string, Creature> => {
//   const dialogueCreatureMap = new Map<string, Creature>();

//   const nr = creatures.find(x => x.header.dialogFileRef === 'nr')!;

//   for (const creature of creatures) {
//     dialogueCreatureMap.set(creature.header.dialogFileRef, creature);

//     for (const extendedDialogFileRef of creature.header.extendedDialogsFileRef) {
//       dialogueCreatureMap.set(extendedDialogFileRef, creature);
//     }
//   }

//   // dialogues with items
//   const talkableItems = [
//     'bead',
//     'bladeim',
//     'dbladeim',
//     'bsphere',
//     'dbsphere',
//     'celesti2',
//     'cheats',
//     'circlez',
//     'codexi',
//     'copearc',
//     'cube',
//     'd0202p',
//     'd202por2',
//   ];
//   for (const item of talkableItems) {
//     dialogueCreatureMap.set(item, nr);
//   }

//   return dialogueCreatureMap;
// };

// const translateDialogues = (
//   npcDialogues: Dlg[],
//   creatures: Creature[],
//   language: string,
//   percentCallback: ((percent: number, resource: string) => void) | null = null,
// ): NpcDialogueEcho[] => {
//   const npcDialogueEchoes: NpcDialogueEcho[] = [];
//   let i = 0;

//   const dialogueCreatureMap = createDialogueCreatureMap(creatures);

//   for (const npcDialogue of npcDialogues) {
//     const resourceNameWithoutExtension = npcDialogue.resourceName.split('.')[0]!;
//     const creature = dialogueCreatureMap.get(resourceNameWithoutExtension);
//     if (!creature) throw new Error(`Cannot detect creature for dialogue '${npcDialogue.resourceName}'`);

//     const npcDialogueEcho = translateDialogue(npcDialogue, creature, language);
//     npcDialogueEchoes.push({
//       resourceName: npcDialogue.resourceName,
//       content: npcDialogueEcho,
//     });

//     const percent = Math.round((i + 1) * 100 / npcDialogues.length);
//     percentCallback?.(percent, npcDialogue.resourceName);
//     i++;
//   }

//   return npcDialogueEchoes;
// };

// export default translateDialogues;
