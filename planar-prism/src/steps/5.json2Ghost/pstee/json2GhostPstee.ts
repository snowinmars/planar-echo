import logger from '@/shared/logger.js';
import { patchTlk } from './tlk/patch.js';
import { patchCres } from './cre/v10/patchCres.js';
import { patchDlgs } from './dlg/v10/patchDlgs.js';
import { patchItms } from './itm/v11/patchItms.js';

import type { Paths } from '../../1.createPaths/types.js';
import type { AllPsteeJsons } from '../../4.biffs2json/types.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { CreOut, CreWithTlk } from './cre/v10/patchCres.types.js';
import type { ItmOut, ItmWithTlk } from './itm/v11/patchItms.types.js';
import type { DlgOut } from './dlg/v10/patchDlgs.types.js';

type AllJsons = AllPsteeJsons; // extend with new games

export const json2GhostPstee = async (
  allJsons: AllJsons,
  paths: Paths,
  discover: DiscoverNext,
): Promise<void> => {
  logger.info(`Converting tlk json to ghost...`);
  const tlk = patchTlk(allJsons.tlk);
  await paths.ghostDir.saveGhost.tlk(`${paths.gameLanguage}.json`, tlk, true);

  logger.info(`Converting cres json to ghost...`);
  const cres = new Map<string, CreOut>();
  const cresIterator = patchCres(allJsons.cres, allJsons.tlk, discover);
  for await (const cre of cresIterator) {
    cres.set(cre.resourceName, cre);
    await paths.ghostDir.saveGhost.cre(`${cre.resourceName.replaceAll(`'`, '')}.ts`, cre.skeleton, true);
  }

  logger.info(`Converting itms json to ghost...`);
  const itms = new Map<string, ItmOut>();
  const itmsIterator = patchItms(allJsons.itms, allJsons.tlk, discover);
  for await (const itm of itmsIterator) {
    itms.set(itm.resourceName, itm);
    await paths.ghostDir.saveGhost.itm(`${itm.resourceName.replaceAll(`'`, '')}.ts`, itm.skeleton, true);
  }

  logger.info(`Converting dlgs json to ghost...`);
  const dlgs = new Map<string, DlgOut>();
  const creMap = new Map<string, CreWithTlk>(cres.values().map(x => [x.resourceName, x.cre]));
  const itmMap = new Map<string, ItmWithTlk>(itms.values().map(x => [x.resourceName, x.itm]));
  const dlgsIterator = patchDlgs(allJsons.dlgs, creMap, itmMap, discover);
  for await (const dlg of dlgsIterator) {
    dlgs.set(dlg.resourceName, dlg);
    await paths.ghostDir.saveGhost.dlg(`${dlg.resourceName.replaceAll(`'`, '')}.ts`, dlg.skeleton, true);
  }
};
