import logger from '@/shared/logger.js';
import { entryExists, loadFromFile, saveToFile } from '@/shared/customFs.js';
import { reportProgress } from '@/shared/report.js';
import decompileAndParseBiffs from './decompileAndParseBiffs.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type {
  DecompiledBiff,
  DecompiledBiffType,
} from './types.js';

export const decompileBiffs = async (paths: Paths): Promise<Map<DecompiledBiffType, DecompiledBiff[]>> => {
  const cacheJson = paths.ghostDir.decompiledBiff.cacheJson;
  const ghostDir = paths.ghostDir.decompiledBiff.root;
  const gameDir = paths.gameDir;

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

    const decompiledBiffs = await decompileAndParseBiffs(paths, x => reportProgress({
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
