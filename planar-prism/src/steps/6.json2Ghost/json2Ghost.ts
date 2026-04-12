import logger from '@/shared/logger.js';
import patchCres from './cre/v10/patch.js';
import patchDlgs from './dlg/v10/patch.js';

import type { Pathes } from '../1.createPathes/types.js';
import type { AllJsons } from '../4.biffs2json/types.js';
import type { GhostCreatureV10, GhostCreatureV12, GhostCreatureV22, GhostCreatureV90, GhostDlg } from './types.js';
import type { DiscoverNext } from '@/discoverer.types.js';

type GhostCreature = GhostCreatureV10 | GhostCreatureV12 | GhostCreatureV22 | GhostCreatureV90;

const json2Ghost = async (
  allJsons: AllJsons,
  pathes: Pathes,
  discover: DiscoverNext,
): Promise<void> => {
  logger.info(`Converting cres json to ghost...`);
  const cres = new Map<string, GhostCreature>();
  const cresIterator = patchCres(allJsons.cres, allJsons.tlk);
  for await (const cre of cresIterator) {
    cres.set(cre.resourceName, cre);
    await pathes.output.saveGhost.creatures(cre.resourceName, cre);
  }

  logger.info(`Converting dlgs json to ghost...`);
  const dlgs = new Map<string, GhostDlg>();
  const dlgsIterator = patchDlgs(allJsons.dlgs, cres, allJsons.tlk, pathes.gameLanguage, discover);
  for await (const dlg of dlgsIterator) {
    dlgs.set(dlg.resourceName, dlg);
    await pathes.output.saveGhost.dialogues(`${dlg.resourceName.replaceAll(`'`, '')}.ts`, dlg.skeleton, true);
    for (const [language, translation] of dlg.translations) await pathes.output.saveGhost.dialogues(`${dlg.resourceName.replaceAll(`'`, '')}.${language}.ts`, translation, true);
  }
};

export default json2Ghost;
