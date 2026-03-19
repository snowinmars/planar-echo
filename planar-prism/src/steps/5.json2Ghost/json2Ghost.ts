import type { Pathes } from '../1.createPathes/types.js';
import type { AllJsons } from '../4.biffs2json/types.js';

const json2Ghost = async (allJsons: AllJsons, pathes: Pathes): Promise<void> => {
  // const zeroPatchedNpdDialogues = zeroPatch(all.npcDialogues);
  // const x = await buildDialogueSkeletons(zeroPatchedNpdDialogues, logPercent);
  // const y = await translateDialogues(zeroPatchedNpdDialogues, all.creatures, 'ru_RU', logPercent);
  // await writeFile(join(pathes.output.json.dialogues, `${x[0]!.resourceName}.ghost.ts`), x[0]!.content, { encoding: 'utf8' });
  // await writeFile(join(pathes.output.json.dialogues, `${y[0]!.resourceName}.ghost.ts`), y[0]!.content, { encoding: 'utf8' });
};

export default json2Ghost;
