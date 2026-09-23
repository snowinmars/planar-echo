import { validateActiveJsonMods } from '@planar/shared';

import { readModsManifests } from './readModsManifests.js';

import type { ActiveJsonMods, ModManifest } from '@planar/shared';

export const previewActiveJson = async (path: string, activeJson: ActiveJsonMods): Promise<string[]> => {
  const manifests = await readModsManifests(path);

  return validateActiveJsonMods(activeJson, new Map<string, ModManifest>(manifests.map(x => [x.id, x])));
};
