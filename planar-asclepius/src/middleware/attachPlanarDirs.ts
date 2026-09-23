import { isNothing, optional } from '@planar/shared';

import { parsePlanarPathsCookie, setPlanarPathsCookie } from '@/helpers/cookie.js';

import type { NextFunction, Request, Response } from 'express';

import type { Paths } from '@/shared/createPaths.types.js';

export const attachPlanarPaths = (defaultPaths: Paths) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const fromCookie = parsePlanarPathsCookie(req.headers.cookie);
  const paths = optional(fromCookie, defaultPaths);
  const fromFile = isNothing(fromCookie);

  req.planarPaths = paths;
  req.planarPathsFromCookie = !fromFile;

  if (fromFile) setPlanarPathsCookie(res, paths);

  next();
};
