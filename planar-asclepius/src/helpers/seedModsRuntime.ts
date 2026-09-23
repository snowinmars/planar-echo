import { cp } from 'fs/promises';
import { join } from 'path';

import { fileExists } from '@planar/shared/node';

import logger from '@/shared/logger.js';

import { forceInstallMods } from './forceInstallMods.js';

export const createActiveJsonIfMissing = async (modsRuntimeDir: string, modsDist: string): Promise<void> => {
  const active = join(modsRuntimeDir, 'active.json');

  const hasActive = await fileExists(active);
  if (hasActive) return;

  const factoryActive = join(modsDist, 'factory-active.json');
  const hasDistFactory = await fileExists(factoryActive);
  if (!hasDistFactory) throw new Error(`Cannot find '${factoryActive}' to create '${active}'`);

  await cp(factoryActive, active);
};

export const seedModsRuntime = async (modsRuntimeDir: string, modsDist: string): Promise<void> => {
  const copied = await forceInstallMods(modsDist, modsRuntimeDir);
  logger.info(`seeded modsDir folders: ${copied.join(', ') || 'none'}`);

  await createActiveJsonIfMissing(modsRuntimeDir, modsDist);
};
