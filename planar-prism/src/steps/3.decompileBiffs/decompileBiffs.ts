import logger from '@/shared/logger.js';
import { entryExists, loadFromFile, saveToFile } from '@/shared/customFs.js';
import { reportProgress } from '@/shared/report.js';
import decompileAndParseBiffs from './decompileAndParseBiffs.js';

import type { Pathes } from '@/steps/1.createPathes/index.js';
import type {
  DecompiledBiff,
  DecompiledBiffType,
} from './types.js';

export const decompileBiffs = async (pathes: Pathes): Promise<Map<DecompiledBiffType, DecompiledBiff[]>> => {
  const cacheJson = pathes.ghostDir.decompiledBiff.cacheJson;
  const ghostDir = pathes.ghostDir.decompiledBiff.root;
  const gameDir = pathes.gameDir;

  reportProgress({
    value: 1,
    step: 'decompileBiffs',
  });

  const hasPreviousDecompilation = await entryExists(cacheJson);
  if (hasPreviousDecompilation) {
    logger.info(`Restore decompilation state from ${cacheJson}`);

    reportProgress({
      value: 100,
      step: 'decompileBiffs',
    });

    return loadFromFile(cacheJson);
  }
  else {
    logger.info(`Decompiling biffs archives from '${gameDir}' to '${ghostDir}'; might take a while`);

    const decompiledBiffs = await decompileAndParseBiffs(pathes, x => reportProgress({
      value: x,
      step: 'decompileBiffs',
    }));
    await saveToFile(cacheJson, decompiledBiffs);

    reportProgress({
      value: 100,
      step: 'decompileBiffs',
    });

    logger.info(`Decompiled biff archives from '${gameDir}' to '${ghostDir}' with cache at ${cacheJson}`);

    return decompiledBiffs;
  }
};
