import logger from '@/shared/logger.js';
import { patchCres } from './cre/v10/patch.js';
import { patchDlgs } from './dlg/v10/patch.js';
import { patchItms } from './itm/v11/patch.js';

import type { Paths } from '../../1.createPaths/types.js';
import type { AllPsteeJsons } from '../../4.biffs2json/types.js';
import type {
  GhostDlg,
  GhostCreature,
  GhostCreatureV10,
  GhostCreatureV11,
  GhostItem,
  GhostItemV10,
} from '../types.js';
import type { DiscoverNext } from '@/discoverer.types.js';

type AllJsons = AllPsteeJsons; // extend with new games

export const json2GhostPstee = async (
  allJsons: AllJsons,
  paths: Paths,
  discover: DiscoverNext,
): Promise<void> => {
  logger.info(`Converting cres json to ghost...`);
  const cres = new Map<string, GhostCreature>();
  const cresIterator = patchCres(allJsons.cres, allJsons.tlk, paths.gameLanguage, discover);
  for await (const cre of cresIterator) {
    cres.set(cre.resourceName, cre);
    await paths.ghostDir.saveGhost.creatures(`${cre.resourceName.replaceAll(`'`, '')}.ts`, cre.skeleton, true);
    for (const [language, translation] of cre.translations) await paths.ghostDir.saveGhost.creatures(`${cre.resourceName.replaceAll(`'`, '')}.${language}.ts`, translation, true);
  }

  logger.info(`Converting itms json to ghost...`);
  const itms = new Map<string, GhostItem>();
  const itmsIterator = patchItms(allJsons.itms, allJsons.tlk, paths.gameLanguage, discover);
  for await (const itm of itmsIterator) {
    itms.set(itm.resourceName, itm);
    await paths.ghostDir.saveGhost.items(`${itm.resourceName.replaceAll(`'`, '')}.ts`, itm.skeleton, true);
    for (const [language, translation] of itm.translations) await paths.ghostDir.saveGhost.items(`${itm.resourceName.replaceAll(`'`, '')}.${language}.ts`, translation, true);
  }

  logger.info(`Converting dlgs json to ghost...`);
  const dlgs = new Map<string, GhostDlg>();
  const creMap = new Map<string, GhostCreatureV10 | GhostCreatureV11>(cres.values().map(x => [x.resourceName, x.ghostCreature]));
  const itemMap = new Map<string, GhostItemV10>(itms.values().map(x => [x.resourceName, x.ghostItem]));
  const dlgsIterator = patchDlgs(allJsons.dlgs, creMap, itemMap, allJsons.tlk, paths.gameLanguage, discover);
  for await (const dlg of dlgsIterator) {
    dlgs.set(dlg.resourceName, dlg);
    await paths.ghostDir.saveGhost.dialogues(`${dlg.resourceName.replaceAll(`'`, '')}.ts`, dlg.skeleton, true);
    for (const [language, translation] of dlg.translations) await paths.ghostDir.saveGhost.dialogues(`${dlg.resourceName.replaceAll(`'`, '')}.${language}.ts`, translation, true);
  }
};
