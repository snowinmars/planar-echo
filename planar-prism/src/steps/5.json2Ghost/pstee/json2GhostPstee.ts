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
import { patchAres } from './are/patchAres.js';
import { patchBmps } from './bmp/patchBmps.js';
import { patchBams } from './bam/patchBams.js';
import { patchWavs } from './wav/patchWavs.js';
import { patchAcms } from './acm/patchAcms.js';
import { patchMuss } from './mus/patchMuss.js';
import { patchEffs } from './eff/patchEffs.js';
import { patchIds } from './ids/patchIds.js';
import { patchTwodas } from './twoda/patchTwodas.js';
import { patchSrcs } from './src/patchSrcs.js';
import { patchInis } from './ini/patchInis.js';

import type { Paths } from '../../1.createPaths/types.js';
import type { AllPsteeJsons } from '../../4.biffs2json/types.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { CreOut } from './cre/v10/patchCres.types.js';
import type { ItmOut } from './itm/v11/patchItms.types.js';
import type { DlgOut } from './dlg/v10/patchDlgs.types.js';

type AllJsons = AllPsteeJsons; // extend with new games

// const ghostTsName = (resourceName: string): string => `${resourceName.replaceAll(`'`, '')}.ts`;

export const json2GhostPstee = async (
  allJsons: AllJsons,
  paths: Paths,
  discover: DiscoverNext,
): Promise<void> => {
  logger.info(`Converting tlk json to ghost...`);
  const tlk = patchTlk(allJsons.tlk);
  await paths.ghostDir.saveGhost.tlk(`${paths.gameLanguage}.json`, tlk, true);

  logger.info(`Converting cre json to ghost...`);
  const cres = new Map<string, CreOut>();
  const cresIterator = patchCres(allJsons.cres, discover);
  for await (const cre of cresIterator) {
    cres.set(cre.resourceName, cre);
    await paths.ghostDir.saveGhost.cre(`${cre.resourceName.replaceAll(`'`, '')}.ts`, cre.skeleton, true);
  }

  logger.info(`Converting itm json to ghost...`);
  const itms = new Map<string, ItmOut>();
  const itmsIterator = patchItms(allJsons.itms, discover);
  for await (const itm of itmsIterator) {
    itms.set(itm.resourceName, itm);
    await paths.ghostDir.saveGhost.itm(`${itm.resourceName.replaceAll(`'`, '')}.ts`, itm.skeleton, true);
  }

  logger.info(`Converting dlg json to ghost...`);
  const dlgs = new Map<string, DlgOut>();
  const creMap = new Map<string, CreOut['cre']>(cres.values().map(x => [x.resourceName, x.cre]));
  const itmMap = new Map<string, ItmOut['itm']>(itms.values().map(x => [x.resourceName, x.itm]));
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
  }

  logger.info(`Converting wed json to ghost...`);
  const wedIterator = patchWed(allJsons.weds);
  for await (const wed of wedIterator) {
    await paths.ghostDir.saveGhost.wed(`${wed.resourceName}.ts`, wed.skeleton, true);
  }

  logger.info(`Converting are json to ghost...`);
  const areIterator = patchAres(allJsons.ares);
  for await (const are of areIterator) {
    await paths.ghostDir.saveGhost.are(`${are.resourceName}.ts`, are.skeleton, true);
  }

  logger.info(`Converting bmp json to ghost...`);
  const bmpIterator = patchBmps(allJsons.bmps);
  for await (const bmp of bmpIterator) {
    await paths.ghostDir.saveGhost.bmp(`${bmp.resourceName}.ts`, bmp.skeleton, true);
  }

  logger.info(`Converting bam json to ghost...`);
  const bamIterator = patchBams(allJsons.bams);
  for await (const bam of bamIterator) {
    await paths.ghostDir.saveGhost.bam(`${bam.resourceName}.ts`, bam.skeleton, true);
  }

  logger.info(`Converting wav json to ghost...`);
  const wavIterator = patchWavs(allJsons.wavs);
  for await (const wav of wavIterator) {
    await paths.ghostDir.saveGhost.wav(`${wav.resourceName}.ts`, wav.skeleton, true);
  }

  logger.info(`Converting acm json to ghost...`);
  const acmIterator = patchAcms(allJsons.acms);
  for await (const acm of acmIterator) {
    await paths.ghostDir.saveGhost.acm(`${acm.resourceName}.ts`, acm.skeleton, true);
  }

  logger.info(`Converting mus json to ghost...`);
  const musIterator = patchMuss(allJsons.muss);
  for await (const mus of musIterator) {
    await paths.ghostDir.saveGhost.mus(`${mus.resourceName}.ts`, mus.skeleton, true);
  }

  logger.info(`Converting eff json to ghost...`);
  const effIterator = patchEffs(allJsons.effs);
  for await (const eff of effIterator) {
    await paths.ghostDir.saveGhost.eff(`${eff.resourceName}.ts`, eff.skeleton, true);
  }

  logger.info(`Converting ids json to ghost...`);
  const idsIterator = patchIds([...allJsons.ids.values()]);
  for await (const ids of idsIterator) {
    await paths.ghostDir.saveGhost.ids(`${ids.resourceName}.ts`, ids.skeleton, true);
  }

  logger.info(`Converting twoda json to ghost...`);
  const twodaIterator = patchTwodas([...allJsons.twoda.values()]);
  for await (const twoda of twodaIterator) {
    await paths.ghostDir.saveGhost.twoda(`${twoda.resourceName}.ts`, twoda.skeleton, true);
  }

  logger.info(`Converting src json to ghost...`);
  const srcIterator = patchSrcs([...allJsons.srcs.values()]);
  for await (const src of srcIterator) {
    await paths.ghostDir.saveGhost.src(`${src.resourceName}.ts`, src.skeleton, true);
  }

  logger.info(`Converting ini json to ghost...`);
  const iniIterator = patchInis([...allJsons.inis.values()]);
  for await (const ini of iniIterator) {
    await paths.ghostDir.saveGhost.ini(`${ini.resourceName}.ts`, ini.skeleton, true);
  }
};
