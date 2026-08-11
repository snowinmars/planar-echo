import logger from '@/shared/logger.js';
import { parseTlk } from './tlk/index.js';
import { parseIds } from './ids/index.js';
import { parseIni } from './ini/index.js';
import { parseCre } from './cre/index.js';
import { parseDlg } from './dlg/index.js';
import { parseEffV20 } from './eff/index.js';
import { parseItm } from './itm/index.js';
import { buildBcsContext, parseBcs } from './bcs/index.js';
import { parseWed } from './wed/index.js';
import { parsePvrz } from './pvrz/index.js';
import { parseTis } from './tis/index.js';
import { decodePvrToRgba } from './pvrz/decode/index.js';
import { isPaletteArtfact } from './tis/v1/parseTisV1.types.js';

import type { Paths } from '../../1.createPaths/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '../../3.decompileBiffs/index.js';
import type { Ids } from './ids/index.js';
import type { Ini } from './ini/index.js';
import type { CreatureV10, CreatureV11 } from './cre/index.js';
import type { RawDlg } from './dlg/index.js';
import type { EffectV20 } from './eff/index.js';
import type { ItmV10 } from './itm/index.js';
import type { Bcs } from './bcs/index.js';
import type { Wed } from './wed/index.js';
import type { Tis } from './tis/index.js';
import type { AllPsteeJsons } from '../types.js';
import type { Pvr } from './pvrz/index.js';
import type { RgbaImage } from './pvrz/decode/index.js';

type Creature = CreatureV10 | CreatureV11;

const mustHaveIds = [
  'diety.ids', // in pstee it is diety, not deity
  'magespec.ids',
  'race.ids',
  'ea.ids',
  'general.ids',
  'class.ids',
  'object.ids',
];

const biffs2jsonPstee = async (
  decompiledBiffs: Map<DecompiledBiffType, DecompiledBiff[]>,
  paths: Paths,
): Promise<AllPsteeJsons> => {
  logger.info(`Converting tlk to json...`);
  const tlk = await parseTlk(paths.tlkDir);
  await paths.ghostDir.saveJson.tlk(`dialogue.${paths.gameLanguage}.json`, tlk);

  ///

  logger.info(`Converting ids to json...`);
  const ids = new Map<string, Ids>();
  const idsIterator = parseIds(paths, decompiledBiffs.get('ids')!);
  for await (const id of idsIterator) {
    ids.set(id.resourceName, id);
    await paths.ghostDir.saveJson.ids(id.resourceName, id);
  }

  for (const mustHaveId of mustHaveIds) if (!ids.has(mustHaveId)) throw new Error(`Pstee sources has '${mustHaveId}' file, but you did not pass it`);

  ///

  logger.info(`Converting bcs to json...`);
  const bcs: Bcs[] = [];
  const bcsItems = decompiledBiffs.get('bcs') ?? [];
  const bcsCtx = await buildBcsContext(ids, paths.ghostDir.cache.xorKey);
  const bcsIterator = parseBcs(paths, bcsItems, bcsCtx);
  for await (const b of bcsIterator) {
    bcs.push(b);
    await paths.ghostDir.saveJson.bcs(`${b.resourceName}.json`, b);
  }

  ///

  logger.info(`Converting ini to json...`);
  const inis = new Map<string, Ini>();
  const iniIterator = parseIni(paths, decompiledBiffs.get('ini')!);
  for await (const ini of iniIterator) {
    if (!ini) continue;
    inis.set(ini.resourceName, ini);
    await paths.ghostDir.saveJson.inis(ini.resourceName, ini);
  }

  ///

  logger.info(`Converting cre to json...`);
  const cres: Creature[] = [];
  const cresIterator = parseCre(paths, decompiledBiffs.get('cre')!, ids);
  for await (const cre of cresIterator) {
    if (!cre) continue;
    cres.push(cre);
    await paths.ghostDir.saveJson.creatures(cre.resourceName, cre);
  }

  ///

  logger.info(`Converting dlg to json...`);
  const dlgs: RawDlg[] = [];
  const emptyDialogues = [
    'dzxxx.dlg',
    'dzxxxx.dlg',
    'ddrndegh.dlg',
    'f.dlg',
    'cheats.dlg',
    'dcheats.dlg',
    'forge.dlg',
    'hthugb3.dlg',
    'over01.dlg',
    'over02.dlg',
    'over03.dlg',
  ];
  const dlgIterator = parseDlg(paths, decompiledBiffs.get('dlg')!.filter(x => !emptyDialogues.includes(x.resourceName)));
  for await (const dlg of dlgIterator) {
    dlgs.push(dlg);
    await paths.ghostDir.saveJson.dialogues(dlg.resourceName, dlg);
  }

  ///

  logger.info(`Converting eff to json...`);
  const effs: EffectV20[] = [];
  // const effIterator = parseEffV10(paths, decompiledBiffs.get('eff')!);
  const effIterator = parseEffV20(paths, decompiledBiffs.get('eff')!);
  for await (const eff of effIterator) {
    effs.push(eff);
    await paths.ghostDir.saveJson.effects(eff.resourceName, eff);
  }

  ///

  logger.info(`Converting itm to json...`);
  const itms: ItmV10[] = [];
  const itmIterator = parseItm(paths, decompiledBiffs.get('itm')!);
  for await (const itm of itmIterator) {
    itms.push(itm);
    await paths.ghostDir.saveJson.items(itm.resourceName, itm);
  }

  ///

  logger.info(`Converting wed to json...`);
  const weds: Wed[] = [];
  const wedItems = decompiledBiffs.get('wed') ?? [];
  const wedIterator = parseWed(paths, wedItems);
  for await (const wed of wedIterator) {
    weds.push(wed);
    await paths.ghostDir.saveJson.wed(wed.resourceName, wed);
  }
  const wedIndex = new Map<string, Wed>(weds.map(wed => [wed.resourceName, wed]));

  ///

  logger.info(`Converting pvrz to json...`);
  const pvrs: Pvr[] = [];
  const pvrzRgbaIndex = new Map<string, RgbaImage>();
  const pvrzItems = decompiledBiffs.get('pvrz') ?? [];
  const pvrzIterator = parsePvrz(paths, pvrzItems);
  for await (const { pvr, pixelData } of pvrzIterator) {
    pvrs.push(pvr);
    pvrzRgbaIndex.set(pvr.resourceName, decodePvrToRgba(pvr, pixelData));
    await paths.ghostDir.saveJson.pvrz(pvr.resourceName, pvr);
  }

  ///

  logger.info(`Converting tis to json...`);
  const tiss: Tis[] = [];
  const tisItems = decompiledBiffs.get('tis') ?? [];
  const tisIterator = parseTis({
    paths,
    decompiledItems: tisItems,
    wedIndex: wedIndex,
    pvrzRgbaIndex,
  });
  for await (const artifacts of tisIterator) {
    tiss.push(artifacts.tis);
    await paths.ghostDir.saveJson.tis(artifacts.tis.resourceName, artifacts.tis);
    await paths.ghostDir.saveBinary.tisImage(artifacts.tis.resourceName, artifacts.png);
    if (isPaletteArtfact(artifacts)) {
      await paths.ghostDir.saveBinary.tisPalette(artifacts.tis.resourceName, artifacts.palette);
      await paths.ghostDir.saveBinary.tisIndices(artifacts.tis.resourceName, artifacts.indices);
    }
  }

  return {
    tlk,
    ids,
    inis,
    cres,
    dlgs,
    effs,
    itms,
    bcs,
    weds,
    pvrs,
    tiss,
  };
};

export default biffs2jsonPstee;
