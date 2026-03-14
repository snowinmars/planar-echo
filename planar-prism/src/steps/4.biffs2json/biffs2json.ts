import logger from '../../shared/logger.js';

import tlkParse from './tlkParse/index.js';
import idsParse, { type Ids } from './idsParse/index.js';

import type { Pathes } from '../1.createPathes/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '../3.decompileBiffs/index.js';
import type { LogPercent } from '../../shared/types.js';

const logPercent: LogPercent = (x, r) => {
  logger.info(`Done ${x}% in '${r}'`);
};

const biffs2json = async (
  decompiledBiffs: Map<DecompiledBiffType, DecompiledBiff[]>,
  pathes: Pathes,
): Promise<void> => {
  logger.info(`Converting tlk to json...`);
  const tlk = await tlkParse(pathes.tlkPath);
  await pathes.output.saveJson.dialogues('dialog.tlk', tlk);

  ///

  logger.info(`Converting ids to json...`);
  const ids: Ids[] = [];
  const idsIterator = idsParse(pathes, decompiledBiffs.get('ids')!, logPercent);
  for await (const id of idsIterator) {
    ids.push(id);
    await pathes.output.saveJson.ids(id.resourceName, id);
  }
};

export default biffs2json;
