import { backendUrl } from '@/shared/modsApi';
import planarLocalStorage from '@/shared/planarLocalStorage';

export type AsclepiusDirs = Readonly<{
  shellDir: string;
  prismDir: string;
  daemonDir: string;
  modsDist: string;
  ghostDir: string;
  modsRuntimeDir: string;
  weiduDir: string;
}>;

const str = (key: string): string => planarLocalStorage.get<string>(key, '') ?? '';

export const readLocalDirs = (): AsclepiusDirs => ({
  shellDir: str('shellDir'),
  prismDir: str('prismDir'),
  daemonDir: str('daemonDir'),
  modsDist: str('modsDist'),
  ghostDir: str('ghostDir'),
  modsRuntimeDir: str('modsRuntimeDir') || str('modsDir'),
  weiduDir: str('weiduDir'),
});

export const writeLocalDirs = (dirs: AsclepiusDirs): void => {
  planarLocalStorage.set('shellDir', dirs.shellDir);
  planarLocalStorage.set('prismDir', dirs.prismDir);
  planarLocalStorage.set('daemonDir', dirs.daemonDir);
  planarLocalStorage.set('modsDist', dirs.modsDist);
  planarLocalStorage.set('ghostDir', dirs.ghostDir);
  planarLocalStorage.set('modsRuntimeDir', dirs.modsRuntimeDir);
  planarLocalStorage.set('modsDir', dirs.modsRuntimeDir);
  planarLocalStorage.set('weiduDir', dirs.weiduDir);
};

const jsonHeaders = { 'Content-Type': 'application/json' };

const credFetch = (url: string, init?: RequestInit): Promise<Response> => (
  fetch(url, { credentials: 'include', ...init })
);

export const fetchDefaults = async (signal?: AbortSignal): Promise<AsclepiusDirs> => {
  const res = await credFetch(`${backendUrl()}/api/defaults`, signal ? { signal } : {});
  if (!res.ok) throw new Error(`GET /api/defaults ${res.status}`);
  return await res.json() as AsclepiusDirs;
};

export const patchDefaults = async (dirs: AsclepiusDirs, signal?: AbortSignal): Promise<AsclepiusDirs> => {
  const res = await credFetch(`${backendUrl()}/api/defaults`, {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(dirs),
    ...(signal ? { signal } : {}),
  });
  if (!res.ok) throw new Error(`PATCH /api/defaults ${res.status}`);
  return await res.json() as AsclepiusDirs;
};

export const putDefaults = async (dirs: AsclepiusDirs, signal?: AbortSignal): Promise<AsclepiusDirs> => {
  const res = await credFetch(`${backendUrl()}/api/defaults`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(dirs),
    ...(signal ? { signal } : {}),
  });
  if (!res.ok) throw new Error(`PUT /api/defaults ${res.status}`);
  return await res.json() as AsclepiusDirs;
};

export const patchLocalDir = async (
  key: keyof AsclepiusDirs,
  value: string,
  signal?: AbortSignal,
): Promise<AsclepiusDirs> => {
  const dirs = { ...readLocalDirs(), [key]: value };
  writeLocalDirs(dirs);
  return patchDefaults(dirs, signal);
};
