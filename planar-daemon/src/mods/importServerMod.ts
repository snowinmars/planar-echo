import { join } from 'path';
import { pathToFileURL } from 'url';

import { isNothing, maybe, SERVER_HOOKS, SERVER_QUERY_NAMES } from '@planar/shared';

import type {
  ModManifest,
  ServerModExports,
} from '@planar/shared';

const isRecord = (value: unknown): value is Record<string, unknown> => !isNothing(value) && typeof value === 'object';

const parseServerModExports = (namespace: unknown, manifest: ModManifest): ServerModExports => {
  if (!isRecord(namespace)) throw new Error(`Mod '${manifest.id}' server.js is not a module object`);

  for (const hookId of SERVER_HOOKS) {
    const declared = manifest.hooks.includes(hookId);
    if (!declared) continue;

    const hook = namespace[hookId];

    const missing = isNothing(hook);
    if (missing) throw new Error(`Mod '${manifest.id}' missing hook '${hookId}', that is required my mod manifest`);

    const notFunction = typeof hook !== 'function';
    if (notFunction) throw new Error(`Mod '${manifest.id}' hook '${hookId}' is not a function`);
  }

  for (const queryId of SERVER_QUERY_NAMES) {
    const declared = manifest.queries.includes(queryId);
    if (!declared) continue;

    const query = namespace[queryId];

    const missing = isNothing(query);
    if (missing) throw new Error(`Mod '${manifest.id}' missing query '${queryId}', that is required my mod manifest`);

    const notFunction = typeof query !== 'function';
    if (notFunction) throw new Error(`Mod '${manifest.id}' query '${queryId}' is not a function, which is required my mod manifest`);
  }

  return {
    onAreaLoad: maybe(namespace.onAreaLoad as ServerModExports['onAreaLoad']),
    onAreaUnload: maybe(namespace.onAreaUnload as ServerModExports['onAreaUnload']),
    onCommand: maybe(namespace.onCommand as ServerModExports['onCommand']),
    onTick: maybe(namespace.onTick as ServerModExports['onTick']),
    floorOverlay: maybe(namespace.floorOverlay as ServerModExports['floorOverlay']),
    occupancy: maybe(namespace.occupancy as ServerModExports['occupancy']),
  };
};

export const importServerMod = async (modsDir: string, manifest: ModManifest): Promise<ServerModExports> => {
  const notServer = !manifest.sides.includes('server');
  if (notServer) throw new Error(`Wrong attempt to import non-server sources from server mod '${manifest.id}'`);

  const href = pathToFileURL(join(modsDir, manifest.id, 'server.js')).href;
  const namespace: unknown = await import(href);
  return parseServerModExports(namespace, manifest);
};
