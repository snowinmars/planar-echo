import { copyFile } from 'fs/promises';
import { join } from 'path';
import logger from '@/shared/logger.js';
import { patchTlk } from './tlk/patch.js';
import { patchCres } from './cre/v10/patchCres.js';
import { patchDlgs } from './dlg/v10/patchDlgs.js';
import { patchItms } from './itm/v11/patchItms.js';
import { patchBcs } from './bcs/patchBcs.js';
import { patchMos } from './mos/patchMos.js';
import { patchPvr } from './pvr/patchPvr.js';
import { patchTis } from './tis/patchTis.js';
import { patchWed } from './wed/patchWed.js';

import type { Paths } from '../../1.createPaths/types.js';
import type { AllPsteeJsons } from '../../4.biffs2json/types.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { CreOut, CreWithTlk } from './cre/v10/patchCres.types.js';
import type { ItmOut, ItmWithTlk } from './itm/v11/patchItms.types.js';
import type { DlgOut } from './dlg/v10/patchDlgs.types.js';

type AllJsons = AllPsteeJsons; // extend with new games

// const ghostTsName = (resourceName: string): string => `${resourceName.replaceAll(`'`, '')}.ts`;

const copyGhostPng = async (jsonDir: string, ghostDir: string, imageName: string): Promise<void> => {
  await copyFile(join(jsonDir, imageName), join(ghostDir, imageName));
};

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

  logger.info(`Converting bcs json to ghost...`);
  const bcsIterator = patchBcs(allJsons.bcs);
  for await (const bcs of bcsIterator) {
    await paths.ghostDir.saveGhost.bcs(`${bcs.resourceName}.ts`, bcs.skeleton, true);
  }

  logger.info(`Converting mos json to ghost...`);
  const mosIterator = patchMos(allJsons.moss);
  for await (const mos of mosIterator) {
    await paths.ghostDir.saveGhost.mos(`${mos.resourceName}.ts`, mos.skeleton, true);
    await copyGhostPng(paths.ghostDir.json.mos, paths.ghostDir.ghost.mos, mos.mos.imageName);
  }

  logger.info(`Converting pvrz json to ghost...`);
  const pvrIterator = patchPvr(allJsons.pvrs);
  for await (const pvr of pvrIterator) {
    await paths.ghostDir.saveGhost.pvrz(`${pvr.resourceName}.ts`, pvr.skeleton, true);
  }

  logger.info(`Converting tis json to ghost...`);
  const tisIterator = patchTis(allJsons.tiss);
  for await (const tis of tisIterator) {
    await paths.ghostDir.saveGhost.tis(`${tis.resourceName}.ts`, tis.skeleton, true);
    await copyGhostPng(paths.ghostDir.json.tis, paths.ghostDir.ghost.tis, tis.tis.imageName);
  }

  logger.info(`Converting wed json to ghost...`);
  const wedIterator = patchWed(allJsons.weds);
  for await (const wed of wedIterator) {
    await paths.ghostDir.saveGhost.wed(`${wed.resourceName}.ts`, wed.skeleton, true);
  }
};
