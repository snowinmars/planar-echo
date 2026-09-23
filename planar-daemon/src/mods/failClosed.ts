import { readFile } from 'fs/promises';
import { readdir } from 'fs/promises';
import { join } from 'path';

import { validateActiveJsonMods } from '@planar/shared';
import { parseModManifest } from '@planar/shared';
import { fileExists } from '@planar/shared/node';

import type { ActiveJsonMods, ModManifest } from '@planar/shared';

const readJson = async <T>(activePath: string): Promise<T> => {
  const raw = await readFile(activePath, 'utf8');
  return JSON.parse(raw) as T;
};

const loadManifests = async (modsDir: string): Promise<Map<string, ModManifest>> => {
  const manifests = new Map<string, ModManifest>();

  const entries = await readdir(modsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const manifestPath = join(modsDir, entry.name, 'mod.json');

    const manifestDirectory = await fileExists(manifestPath);
    if (!manifestDirectory) continue;

    const manifestJson = await readJson<ActiveJsonMods>(manifestPath);
    const manifest = parseModManifest(manifestJson);

    const brokenManifestId = manifest.id !== entry.name;
    if (brokenManifestId) throw new Error(`Unexpected mod id: '${manifest.id}' in mod.json, but '${entry.name}' in active.json`);

    manifests.set(manifest.id, manifest);
  }

  return manifests;
};

type BootServerModsResponse = Readonly<{
  active: ActiveJsonMods;
  manifests: Map<string, ModManifest>;
}>;
export const bootServerMods = async (modsDir: string): Promise<BootServerModsResponse> => {
  const activePath = join(modsDir, 'active.json');
  const hasActive = await fileExists(activePath);
  if (!hasActive) throw new Error(`active.json is missing at '${activePath}'`);

  const active = await readJson<ActiveJsonMods>(activePath);
  const manifests = await loadManifests(modsDir);

  for (const [id, on] of Object.entries(active.enabled)) {
    if (!on) continue;
    const manifest = manifests.get(id);

    if (!manifest) throw new Error(`enabled mod '${id}' has no mod.json`);

    const isServer = manifest.sides.includes('server');
    const isClient = manifest.sides.includes('client');

    if (isServer) {
      const serverJs = join(modsDir, id, 'server.js');
      if (!await fileExists(serverJs)) throw new Error(`mod '${id}' declared server side without server.js`);
    }

    if (isClient) {
      const clientJs = join(modsDir, id, 'client.js');
      if (!await fileExists(clientJs)) throw new Error(`mod '${id}' declared client side without client.js`);
    }
  }

  const errors = validateActiveJsonMods(active, manifests);
  if (errors.length > 0) throw new Error(errors.join('; '));

  return {
    active,
    manifests,
  };
};
