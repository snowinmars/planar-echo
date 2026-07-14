import logger from '@/shared/logger.js';
import { parseTlk } from './tlk/index.js';
import { parseIds } from './ids/index.js';
import { parseIni } from './ini/index.js';
import { parseCre } from './cre/index.js';
import { parseDlg } from './dlg/index.js';
import { parseEffV20 } from './eff/index.js';
import { parseItm } from './itm/index.js';

import type { Pathes } from '../../1.createPathes/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '../../3.decompileBiffs/index.js';
import type { Ids } from './ids/index.js';
import type { Ini } from './ini/index.js';
import type { CreatureV10, CreatureV11 } from './cre/index.js';
import type { RawDlg } from './dlg/index.js';
import type { EffectV20 } from './eff/index.js';
import type { ItmV10 } from './itm/index.js';
import type { AllPsteeJsons } from '../types.js';

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
  pathes: Pathes,
): Promise<AllPsteeJsons> => {
  logger.info(`Converting tlk to json...`);
  const tlk = await parseTlk(pathes.tlkDir);
  await pathes.ghostDir.saveJson.dialogues('dialog.tlk', tlk);

  ///

  logger.info(`Converting ids to json...`);
  const ids = new Map<string, Ids>();
  const idsIterator = parseIds(pathes, decompiledBiffs.get('ids')!);
  for await (const id of idsIterator) {
    ids.set(id.resourceName, id);
    await pathes.ghostDir.saveJson.ids(id.resourceName, id);
  }

  for (const mustHaveId of mustHaveIds) if (!ids.has(mustHaveId)) throw new Error(`Pstee sources has '${mustHaveId}' file, but you did not pass it`);

  ///

  logger.info(`Converting ini to json...`);
  const inis = new Map<string, Ini>();
  const iniIterator = parseIni(pathes, decompiledBiffs.get('ini')!);
  for await (const ini of iniIterator) {
    if (!ini) continue;
    inis.set(ini.resourceName, ini);
    await pathes.ghostDir.saveJson.inis(ini.resourceName, ini);
  }

  ///

  logger.info(`Converting cre to json...`);
  const cres: Creature[] = [];
  const cresIterator = parseCre(pathes, decompiledBiffs.get('cre')!, ids);
  for await (const cre of cresIterator) {
    if (!cre) continue;
    cres.push(cre);
    await pathes.ghostDir.saveJson.creatures(cre.resourceName, cre);
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
  const dlgIterator = parseDlg(pathes, decompiledBiffs.get('dlg')!.filter(x => !emptyDialogues.includes(x.resourceName)));
  for await (const dlg of dlgIterator) {
    dlgs.push(dlg);
    await pathes.ghostDir.saveJson.dialogues(dlg.resourceName, dlg);
  }

  ///

  logger.info(`Converting eff to json...`);
  const effs: EffectV20[] = [];
  // const effIterator = parseEffV10(pathes, decompiledBiffs.get('eff')!);
  const effIterator = parseEffV20(pathes, decompiledBiffs.get('eff')!);
  for await (const eff of effIterator) {
    effs.push(eff);
    await pathes.ghostDir.saveJson.effects(eff.resourceName, eff);
  }

  ///

  logger.info(`Converting itm to json...`);
  const itms: ItmV10[] = [];
  const itmIterator = parseItm(pathes, decompiledBiffs.get('itm')!);
  for await (const itm of itmIterator) {
    itms.push(itm);
    await pathes.ghostDir.saveJson.items(itm.resourceName, itm);
  }

  return {
    tlk,
    ids,
    inis,
    cres,
    dlgs,
    effs,
    itms,
  };
};

export default biffs2jsonPstee;
