import logger from '@/shared/logger.js';
import patchCres from './cre/v10/patch.js';
import patchDlgs from './dlg/v10/patch.js';

import type { Pathes } from '../1.createPathes/types.js';
import type { AllJsons } from '../4.biffs2json/types.js';
import type { GhostCreatureV10, GhostCreatureV12, GhostCreatureV22, GhostCreatureV90, GhostDlg } from './types.js';

type GhostCreature = GhostCreatureV10 | GhostCreatureV12 | GhostCreatureV22 | GhostCreatureV90;

const json2Ghost = async (allJsons: AllJsons, pathes: Pathes): Promise<void> => {
  logger.info(`Converting cres json to ghost...`);
  const cres = new Map<string, GhostCreature>();
  const cresIterator = patchCres(allJsons.cres, allJsons.tlk);
  for await (const cre of cresIterator) {
    cres.set(cre.resourceName, cre);
    await pathes.output.saveGhost.creatures(cre.resourceName, cre);
  }

  logger.info(`Converting dlgs json to ghost...`);
  const dlgs = new Map<string, GhostDlg>();
  const dlgsIterator = patchDlgs(allJsons.dlgs, cres, allJsons.tlk, pathes.gameLanguage);
  for await (const dlg of dlgsIterator) {
    dlgs.set(dlg.resourceName, dlg);
    await pathes.output.saveGhost.dialogues(`${dlg.resourceName}.ts`, dlg.skeleton, true);
    for (const [language, translation] of dlg.translations) await pathes.output.saveGhost.dialogues(`${dlg.resourceName}.${language}.ts`, translation, true);
    await pathes.output.saveGhost.dialogues(`${dlg.resourceName}.types.ts`, dlg.types, true);
  }

  // await writeFile(join(pathes.output.json.dialogues, `${x[0]!.resourceName}.ghost.ts`), x[0]!.content, { encoding: 'utf8' });
  // await writeFile(join(pathes.output.json.dialogues, `${y[0]!.resourceName}.ghost.ts`), y[0]!.content, { encoding: 'utf8' });
};

export default json2Ghost;
