import logger from '../../shared/logger.js';
import { entryExists, loadFromFile, saveToFile } from '../../shared/customFs.js';

import decompileAndParseBiffs from './decompileAndParseBiffs.js';

import type {
  DecompiledBiff,
  DecompiledBiffType,
} from './types.js';
import type { Pathes } from '../1.createPathes/index.js';

const decompileBiffs = async (pathes: Pathes): Promise<Map<DecompiledBiffType, DecompiledBiff[]>> => {
  const cacheJson = pathes.output.decimpiledBiff.cacheJson;
  const output = pathes.output.decimpiledBiff.root;
  const gameFolder = pathes.gameFolder;

  const hasPreviousDecompilation = await entryExists(cacheJson);
  if (hasPreviousDecompilation) {
    logger.info(`Restore decompilation state from ${cacheJson}`);

    return loadFromFile(cacheJson);
  }
  else {
    logger.info(`Decompiling biffs archives from '${gameFolder}' to '${output}'; might take a while`);

    const decompiledBiffs = await decompileAndParseBiffs(pathes);
    await saveToFile(cacheJson, decompiledBiffs);

    logger.info(`Decompiled biff archives from '${gameFolder}' to '${output}' with cache at ${cacheJson}`);

    return decompiledBiffs;
  }
};

export default decompileBiffs;
