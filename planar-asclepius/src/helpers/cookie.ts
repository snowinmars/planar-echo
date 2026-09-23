import { nothing } from '@planar/shared';

import { pathsSchema } from '@/shared/createPaths.types.js';

import type { Response } from 'express';

import type { Maybe } from '@planar/shared';

import type { Paths } from '@/shared/createPaths.types.js';

const PLANAR_DIRS_COOKIE = 'planar_dirs';

const parseCookieHeader = (header: Maybe<string>): Record<string, string> => {
  if (!header) return {};

  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const cut = part.indexOf('=');
    if (cut < 1) continue;
    const name = part.slice(0, cut).trim();
    const value = part.slice(cut + 1).trim();
    out[name] = value;
  }

  return out;
};

export const parsePlanarPathsCookie = (cookieHeader: Maybe<string>): Maybe<Paths> => {
  const raw = parseCookieHeader(cookieHeader)[PLANAR_DIRS_COOKIE];
  if (!raw) return nothing();

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    const dirs = pathsSchema.safeParse(parsed);

    return dirs.success ? dirs.data : nothing();
  }
  catch {
    return nothing();
  }
};

export const setPlanarPathsCookie = (res: Response, dirs: Paths): Paths => {
  const value = encodeURIComponent(JSON.stringify(dirs));

  res.append('Set-Cookie', `${PLANAR_DIRS_COOKIE}=${value}; Path=/; SameSite=Lax; HttpOnly`);

  return dirs;
};
