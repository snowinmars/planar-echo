import {
  CLIENT_HOOKS,
  parseModManifest,
  validateActiveJsonMods,
} from '@planar/shared';

import type {
  ActiveJsonMods,
  ClientModExports,
  ModManifest,
} from '@planar/shared';

export class ClientBootError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientBootError';
  }
}

export type LoadedClientMod = Readonly<{
  manifest: ModManifest;
  exports: ClientModExports;
}>;

const importClientJs = async (url: string): Promise<ClientModExports> => {
  const res = await fetch(url, { credentials: 'include' });
  const failed = !res.ok;
  if (failed) throw new ClientBootError(`GET ${url} ${res.status}`);

  const src = await res.text();
  const blob = new Blob([src], { type: 'text/javascript' });
  const blobUrl = URL.createObjectURL(blob);
  try {
    return await import(/* @vite-ignore */ blobUrl) as ClientModExports;
  }
  finally {
    URL.revokeObjectURL(blobUrl);
  }
};

export const bootClientMods = async (props: {
  serverUrl: string;
}): Promise<{ active: ActiveJsonMods; mods: LoadedClientMod[] }> => {
  const activeRes = await fetch(`${props.serverUrl}/api/mods/activeJson`, { credentials: 'include' });
  const missingActive = activeRes.status === 404;
  if (missingActive) {
    throw new ClientBootError('active.json is missing — open /mods and write factory');
  }
  const activeFailed = !activeRes.ok;
  if (activeFailed) throw new ClientBootError(`active.json HTTP ${activeRes.status}`);
  const active = await activeRes.json() as ActiveJsonMods;

  const listRes = await fetch(`${props.serverUrl}/api/mods`, { credentials: 'include' });
  const listFailed = !listRes.ok;
  if (listFailed) throw new ClientBootError(`GET /api/mods HTTP ${listRes.status}`);
  const list = await listRes.json() as {
    mods: ReadonlyArray<{ id: string; manifest: unknown }>;
  };
  const manifests = new Map<string, ModManifest>();
  for (const row of list.mods) {
    try {
      const manifest = parseModManifest(row.manifest);
      const idMismatch = manifest.id !== row.id;
      if (idMismatch) {
        throw new ClientBootError(`mod.json id '${manifest.id}' != folder '${row.id}'`);
      }
      manifests.set(row.id, manifest);
    }
    catch (err: unknown) {
      const already = err instanceof ClientBootError;
      if (already) throw err;
      const message = err instanceof Error ? err.message : String(err);
      throw new ClientBootError(`mod '${row.id}': ${message}`);
    }
  }

  const errors = validateActiveJsonMods(active, manifests);
  const invalidActive = errors.length > 0;
  if (invalidActive) throw new ClientBootError(errors.join('; '));

  const mods: LoadedClientMod[] = [];
  for (const [id, manifest] of manifests) {
    const disabled = !active.enabled[id];
    if (disabled) continue;

    const notClient = !manifest.sides.includes('client');
    if (notClient) continue;

    const href = `${props.serverUrl}/mods/${encodeURIComponent(id)}/client.js`;
    const probe = await fetch(href, { method: 'GET', credentials: 'include' });
    const missingClientJs = !probe.ok;
    if (missingClientJs) throw new ClientBootError(`mod '${id}' declared client side without client.js`);

    const exports = await importClientJs(href);
    for (const hook of manifest.hooks) {
      const notClientHook = !(CLIENT_HOOKS as readonly string[]).includes(hook);
      if (notClientHook) continue;

      const missingLoad = hook === 'onAreaLoad' && !exports.onAreaLoad;
      if (missingLoad) throw new ClientBootError(`mod '${id}' missing onAreaLoad`);

      const missingUnload = hook === 'onAreaUnload' && !exports.onAreaUnload;
      if (missingUnload) throw new ClientBootError(`mod '${id}' missing onAreaUnload`);

      const missingPatches = hook === 'onPatches' && !exports.onPatches;
      if (missingPatches) throw new ClientBootError(`mod '${id}' missing onPatches`);

      const missingFrame = hook === 'onFrame' && !exports.onFrame;
      if (missingFrame) throw new ClientBootError(`mod '${id}' missing onFrame`);
    }

    mods.push({
      manifest,
      exports,
    });
  }

  return { active, mods };
};

export const clientHookOrder = (
  active: ActiveJsonMods,
  mods: LoadedClientMod[],
  hook: 'onAreaLoad' | 'onAreaUnload' | 'onPatches' | 'onFrame',
): LoadedClientMod[] => {
  const ids = active.clientHooks[hook] ?? [];
  const byId = new Map(mods.map(mod => [mod.manifest.id, mod]));
  const ordered: LoadedClientMod[] = [];
  for (const id of ids) {
    const disabled = !active.enabled[id];
    if (disabled) continue;

    const mod = byId.get(id);
    if (!mod) continue;

    const undeclared = !mod.manifest.hooks.includes(hook);
    if (undeclared) continue;

    ordered.push(mod);
  }
  return ordered;
};
