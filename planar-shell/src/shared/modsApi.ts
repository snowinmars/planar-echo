import { COMPOSED_QUERY_NAMES, RADIO_SLOTS } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import type { ActiveJsonMods, ComposedQueryName, ModManifest, RadioSlot } from '@planar/shared';

export const backendUrl = (): string => (
  planarLocalStorage.get<string>('serverUrl', 'http://localhost:3003') ?? 'http://localhost:3003'
);

export type DiskModRow = Readonly<{
  id: string;
  manifest: ModManifest;
  hasClientJs: boolean;
  hasServerJs: boolean;
}>;

export type SetActiveResult
  = | { ok: true }
    | { ok: false; errors: string[] };

const jsonHeaders = { 'Content-Type': 'application/json' };

const credFetch = (url: string, init?: RequestInit): Promise<Response> => (
  fetch(url, { credentials: 'include', ...init })
);

type InstallErrorBody = { error?: { message?: string } };

const readJson = async <T>(res: Response): Promise<T> => {
  const body = await res.json() as T;
  return body;
};

export const fetchModsList = async (serverUrl: string): Promise<{ modsDir: string; mods: DiskModRow[] }> => {
  const res = await credFetch(`${serverUrl}/api/mods`);
  if (!res.ok) throw new Error(`GET /api/mods ${res.status}`);
  return readJson(res);
};

export const fetchActiveJson = async (serverUrl: string): Promise<ActiveJsonMods | undefined> => {
  const res = await credFetch(`${serverUrl}/api/mods/activeJson`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`GET /api/mods/activeJson ${res.status}`);
  const data = await readJson<ActiveJsonMods>(res);
  return {
    ...data,
    queries: data.queries ?? {},
  };
};

export const setActiveJsonMods = async (serverUrl: string, active: ActiveJsonMods): Promise<SetActiveResult> => {
  const res = await credFetch(`${serverUrl}/api/mods/activeJson`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(active),
  });
  if (res.status === 400) {
    const body = await readJson<{ errors: string[] }>(res);
    const errors = body.errors ?? [`PUT /api/mods/activeJson ${res.status}`];
    return { ok: false, errors };
  }
  if (!res.ok) throw new Error(`PUT /api/mods/activeJson ${res.status}`);
  return { ok: true };
};

export const postInstallDefaults = async (serverUrl: string): Promise<{ copied: string[] }> => {
  const res = await credFetch(`${serverUrl}/api/mods/install-defaults`, { method: 'POST' });
  if (!res.ok) {
    const empty: InstallErrorBody = {};
    const body = await readJson<InstallErrorBody>(res).catch(() => empty);
    const fromBody = body.error?.message;
    throw new Error(fromBody ?? `POST /api/mods/install-defaults ${res.status}`);
  }
  return readJson(res);
};

export const emptyActive = (): ActiveJsonMods => ({
  slots: {
    areaRender: null,
    actorRender: null,
    pathing: null,
    populate: null,
    travel: null,
    doors: null,
    collision: null,
  },
  enabled: {},
  serverHooks: {},
  clientHooks: {},
  queries: {},
});

export { RADIO_SLOTS };
export const QUERY_NAMES: ComposedQueryName[] = [...COMPOSED_QUERY_NAMES];
export type { RadioSlot };
