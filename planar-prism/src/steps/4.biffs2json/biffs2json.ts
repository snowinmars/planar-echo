import logger from '@/shared/logger.js';
import { parseTlk } from './tlk/index.js';
import { parseIds } from './ids/index.js';
import { parseIni } from './ini/index.js';
import { parseCre } from './cre/index.js';
import { parseDlg } from './dlg/index.js';
import { parseEffV10, parseEffV20 } from './eff/index.js';
import { parseItm } from './itm/index.js';

import type { LogPercent } from '@/shared/types.js';
import type { Pathes } from '../1.createPathes/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '../3.decompileBiffs/index.js';
import type { Ids } from './ids/index.js';
import type { Ini } from './ini/index.js';
import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from './cre/index.js';
import type { Dlg } from './dlg/index.js';
import type { EffectV10 } from './eff/index.js';
import type { EffectV20 } from './eff/index.js';
import type { ItmV10, ItmV11, ItmV20 } from './itm/index.js';
import type { AllJsons } from './types.js';

type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;
type Itm = ItmV10 | ItmV11 | ItmV20;
type Effect = EffectV10 | EffectV20;

const logPercent: LogPercent = (x, r) => {
  logger.debug(`Done ${x}% in '${r}'`);
};

const getProgressPercentage = (action: string): number => {
  switch (action) {
    case 'parseTlk': return 0;
    case 'parseIds': return 3;
    case 'parseIni': return 6;
    case 'parseCre': return 10;
    case 'parseDlg': return 13;
    case 'parseEffV10': return 16;
    case 'parseEffV20': return 16;
    case 'parseItm': return 20;
    //
    case 'parseTwoda': return 23;
    case 'parseAre': return 26;
    case 'parseBam': return 30;
    case 'parseBcs': return 33;
    case 'parseBmp': return 36;
    case 'parseChu': return 40;
    case 'parseGlsl': return 43;
    case 'parseLua': return 46;
    case 'parseMenu': return 50;
    case 'parseMos': return 53;
    case 'parsePvrz': return 56;
    case 'parsePro': return 60;
    case 'parseQsp': return 63;
    case 'parseSpl': return 66;
    case 'parseSrc': return 70;
    case 'parseSto': return 73;
    case 'parseTis': return 76;
    case 'parseTtf': return 80;
    case 'parseVvc': return 83;
    case 'parseWav': return 86;
    case 'parseWbm': return 90;
    case 'parseWed': return 93;
    case 'parseWmp': return 96;
    default: throw new Error(`Out of range action '${action}' for getProgressPercentage`);
  }
};

const biffs2json = async (
  decompiledBiffs: Map<DecompiledBiffType, DecompiledBiff[]>,
  pathes: Pathes,
): Promise<AllJsons> => {
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
  const effs: Effect[] = [];
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

export default biffs2json;
