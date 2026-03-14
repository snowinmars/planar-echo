import logger from '../../shared/logger.js';

import parseTlk from './tlk/index.js';
import parseIds from './ids/index.js';
import parseIni from './ini/parseIni.js';
import parseCre from './cre/index.js';
import parseDlg from './dlg/index.js';
import parseEffV10 from './eff/parseEffV10.js';
import parseEffV20 from './eff/parseEffV20.js';

import type { Pathes } from '../1.createPathes/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '../3.decompileBiffs/index.js';
import type { LogPercent } from '../../shared/types.js';
import type { Ids } from './ids/index.js';
import type { Ini } from './ini/index.js';
import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from './cre/types.js';
import type { Dlg } from './dlg/types.js';
import type { EffectV10 } from './eff/v10.types/effectV10.js';
import type { EffectV20 } from './eff/v20.types/effectV20.js';
import type { ItmV10, ItmV11, ItmV20 } from './itm/types.js';
import parseItm from './itm/parseItm.js';

type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;
type Itm = ItmV10 | ItmV11 | ItmV20;

const logPercent: LogPercent = (x, r) => {
  logger.info(`Done ${x}% in '${r}'`);
};

const biffs2json = async (
  decompiledBiffs: Map<DecompiledBiffType, DecompiledBiff[]>,
  pathes: Pathes,
): Promise<void> => {
  logger.info(`Converting tlk to json...`);
  const tlk = await parseTlk(pathes.tlkPath);
  await pathes.output.saveJson.dialogues('dialog.tlk', tlk);

  ///

  logger.info(`Converting ids to json...`);
  const ids = new Map<string, Ids>();
  const idsIterator = parseIds(pathes, decompiledBiffs.get('ids')!, logPercent);
  for await (const id of idsIterator) {
    ids.set(id.resourceName, id);
    await pathes.output.saveJson.ids(id.resourceName, id);
  }

  ///

  logger.info(`Converting ini to json...`);
  const inis = new Map<string, Ini>();
  const iniIterator = parseIni(pathes, decompiledBiffs.get('ini')!, ids, logPercent);
  for await (const ini of iniIterator) {
    if (!ini) continue;
    inis.set(ini.resourceName, ini);
    await pathes.output.saveJson.inis(ini.resourceName, ini);
  }

  ///

  logger.info(`Converting cre to json...`);
  const cres: Creature[] = [];
  const cresIterator = parseCre(pathes, decompiledBiffs.get('cre')!, tlk, ids, logPercent);
  for await (const cre of cresIterator) {
    if (!cre) continue;
    cres.push(cre);
    await pathes.output.saveJson.creatures(cre.resourceName, cre);
  }

  ///

  logger.info(`Converting dlg to json...`);
  const dlgs: Dlg[] = [];
  const dlgIterator = parseDlg(pathes, decompiledBiffs.get('dlg')!, tlk, ids, logPercent);
  for await (const dlg of dlgIterator) {
    dlgs.push(dlg);
    await pathes.output.saveJson.dialogues(dlg.resourceName, dlg);
  }

  ///

  logger.info(`Converting eff to json...`);
  const effs: (EffectV10 | EffectV20)[] = [];
  // const effIterator = parseEffV10(pathes, decompiledBiffs.get('eff')!, ids, logPercent);
  const effIterator = parseEffV20(pathes, decompiledBiffs.get('eff')!, ids, logPercent);
  for await (const eff of effIterator) {
    effs.push(eff);
    await pathes.output.saveJson.effects(eff.resourceName, eff);
  }

  ///

  logger.info(`Converting itm to json...`);
  const itms: Itm[] = [];
  const itmIterator = parseItm(pathes, decompiledBiffs.get('itm')!, ids, logPercent);
  for await (const itm of itmIterator) {
    itms.push(itm);
    await pathes.output.saveJson.items(itm.resourceName, itm);
  }
};

export default biffs2json;
