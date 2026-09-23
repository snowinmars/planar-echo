import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { parseModManifest } from '@planar/shared';
import { fileExists } from '@planar/shared/node';

import type { ModManifest } from '@planar/shared';

export const readModsManifests = async (path: string): Promise<ModManifest[]> => {
  const entries = await readdir(path, { withFileTypes: true });

  const manifests: ModManifest[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const manifestPath = join(path, entry.name, 'mod.json');

    const isModFolder = await fileExists(manifestPath);
    if (!isModFolder) continue;

    const json = JSON.parse(await readFile(manifestPath, 'utf8'));
    const manifest = parseModManifest(json);

    manifests.push(manifest);
  }

  return manifests;
};
