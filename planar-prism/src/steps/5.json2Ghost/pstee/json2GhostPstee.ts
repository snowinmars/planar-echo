import logger from '@/shared/logger.js';
import { patchCres } from './cre/v10/patch.js';
import { patchDlgs } from './dlg/v10/patch.js';
import { patchItms } from './itm/v11/patch.js';

import type { Pathes } from '../../1.createPathes/types.js';
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
  pathes: Pathes,
  discover: DiscoverNext,
): Promise<void> => {
  logger.info(`Converting cres json to ghost...`);
  const cres = new Map<string, GhostCreature>();
  const cresIterator = patchCres(allJsons.cres, allJsons.tlk, pathes.gameLanguage, discover);
  for await (const cre of cresIterator) {
    cres.set(cre.resourceName, cre);
    await pathes.ghostDir.saveGhost.creatures(`${cre.resourceName.replaceAll(`'`, '')}.ts`, cre.skeleton, true);
    for (const [language, translation] of cre.translations) await pathes.ghostDir.saveGhost.creatures(`${cre.resourceName.replaceAll(`'`, '')}.${language}.ts`, translation, true);
  }

  logger.info(`Converting itms json to ghost...`);
  const itms = new Map<string, GhostItem>();
  const itmsIterator = patchItms(allJsons.itms, allJsons.tlk, pathes.gameLanguage, discover);
  for await (const itm of itmsIterator) {
    itms.set(itm.resourceName, itm);
    await pathes.ghostDir.saveGhost.items(`${itm.resourceName.replaceAll(`'`, '')}.ts`, itm.skeleton, true);
    for (const [language, translation] of itm.translations) await pathes.ghostDir.saveGhost.items(`${itm.resourceName.replaceAll(`'`, '')}.${language}.ts`, translation, true);
  }

  logger.info(`Converting dlgs json to ghost...`);
  const dlgs = new Map<string, GhostDlg>();
  const creMap = new Map<string, GhostCreatureV10 | GhostCreatureV11>(cres.values().map(x => [x.resourceName, x.ghostCreature]));
  const itemMap = new Map<string, GhostItemV10>(itms.values().map(x => [x.resourceName, x.ghostItem]));
  const dlgsIterator = patchDlgs(allJsons.dlgs, creMap, itemMap, allJsons.tlk, pathes.gameLanguage, discover);
  for await (const dlg of dlgsIterator) {
    dlgs.set(dlg.resourceName, dlg);
    await pathes.ghostDir.saveGhost.dialogues(`${dlg.resourceName.replaceAll(`'`, '')}.ts`, dlg.skeleton, true);
    for (const [language, translation] of dlg.translations) await pathes.ghostDir.saveGhost.dialogues(`${dlg.resourceName.replaceAll(`'`, '')}.${language}.ts`, translation, true);
  }
};
