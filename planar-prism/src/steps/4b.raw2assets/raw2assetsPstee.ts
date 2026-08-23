import { join } from 'path';
import logger from '@/shared/logger.js';
import { runPool, packPvrzSab } from '@/shared/pool/index.js';
import { collectAcmFiles } from './collectAcmFiles.js';
import { isNothing } from '@planar/shared';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '@/steps/3.decompileBiffs/index.js';
import type { AllPsteeJsons } from '@/steps/4.biffs2json/types.js';
import type { PoolJob } from '@/shared/pool/index.js';
import type { RawPvrRgbaImage } from './algo/pvrz/index.js';
import type { PvrzAssetResult } from './writePvrz.js';
import type { WavAssetResult } from './writeWav.js';
import type { AcmAssetResult } from './writeAcm.js';
import type { ParseAcmContext } from './writeAcm.js';

const toJobs = (items: ReadonlyArray<{ resourceName: string }>): PoolJob[] =>
  items.map(item => ({ resourceName: item.resourceName, payload: item }));

const drain = async <T>(gen: AsyncGenerator<T>, onEach?: (value: T) => Promise<void>): Promise<void> => {
  for await (const value of gen) {
    if (onEach) await onEach(value);
  }
};

export const raw2assetsPstee = async (
  allJsons: AllPsteeJsons,
  _decompiledBiffs: Map<DecompiledBiffType, DecompiledBiff[]>,
  paths: Paths,
): Promise<void> => {
  const decompiledRoot = paths.ghostDir.decompiledBiff.root;
  const assetsRoot = paths.ghostDir.assets.root;

  logger.info(`Converting pvrz to assets...`);
  const pvrzRgbaIndex = new Map<string, RawPvrRgbaImage>();
  await drain(runPool<PvrzAssetResult>({
    kind: 'pvrz',
    jobs: toJobs(allJsons.pvrs),
    decompiledRoot,
    assetsRoot,
    step: 'pvrz_raw2assets',
  }), async (result) => {
    pvrzRgbaIndex.set(result.resourceName, {
      width: result.width,
      height: result.height,
      data: result.data,
    });
  });
  const packedPvrz = packPvrzSab(pvrzRgbaIndex);
  pvrzRgbaIndex.clear();

  logger.info(`Converting bam to assets...`);
  await drain(runPool({
    kind: 'bam',
    jobs: toJobs(allJsons.bams),
    decompiledRoot,
    assetsRoot,
    step: 'bam_raw2assets',
    context: packedPvrz,
  }));

  logger.info(`Converting mos to assets...`);
  await drain(runPool({
    kind: 'mos',
    jobs: toJobs(allJsons.moss),
    decompiledRoot,
    assetsRoot,
    step: 'mos_raw2assets',
    context: packedPvrz,
  }));

  logger.info(`Converting tis to assets...`);
  await drain(runPool({
    kind: 'tis',
    jobs: toJobs(allJsons.tiss),
    decompiledRoot,
    assetsRoot,
    step: 'tis_raw2assets',
    context: packedPvrz,
  }));

  logger.info(`Converting bmp to assets...`);
  await drain(runPool({
    kind: 'bmp',
    jobs: toJobs(allJsons.bmps),
    decompiledRoot,
    assetsRoot,
    step: 'bmp_raw2assets',
  }));

  logger.info(`Converting wav to assets...`);
  await drain(runPool<WavAssetResult>({
    kind: 'wav',
    jobs: toJobs(allJsons.wavs),
    decompiledRoot,
    assetsRoot,
    step: 'wav_raw2assets',
  }), async (result) => {
    const idx = allJsons.wavs.findIndex(w => w.resourceName === result.wav.resourceName);
    if (idx < 0) throw new Error(`Missing wav json for '${result.wav.resourceName}'`);
    allJsons.wavs[idx] = result.wav;
    await paths.ghostDir.saveJson.wav(result.wav.resourceName, result.wav);
  });

  logger.info(`Converting acm to assets...`);
  const musicDir = join(paths.gameDir, 'music');
  const acmFiles = await collectAcmFiles(musicDir);
  const absPathByName: Record<string, string> = {};
  for (const file of acmFiles) absPathByName[file.resourceName] = file.absPath;
  await drain(runPool<AcmAssetResult>({
    kind: 'acm',
    jobs: toJobs(allJsons.acms),
    decompiledRoot,
    assetsRoot,
    step: 'acm_raw2assets',
    context: { absPathByName } satisfies ParseAcmContext,
  }), async (result) => {
    const idx = allJsons.acms.findIndex(a => a.resourceName === result.acm.resourceName);
    if (idx < 0) throw new Error(`Missing acm json for '${result.acm.resourceName}'`);
    allJsons.acms[idx] = result.acm;
    await paths.ghostDir.saveJson.acm(result.acm.resourceName, result.acm);
  });

  // TODO [snow]: where is the explored mask?
  // logger.info(`Converting are explored to assets...`);
  // await drain(runPool({
  //   kind: 'are',
  //   jobs: toJobs(allJsons.ares.filter(are => !isNothing(are.exploredBitmaskName))),
  //   decompiledRoot,
  //   assetsRoot,
  //   step: 'are_raw2assets',
  // }));
};
