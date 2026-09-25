import type { NextFunction, Request, Response } from 'express';

import type { Paths } from '@/shared/createPaths.types.js';

export const attachPlanarPaths = (paths: Paths) => (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  req.planarPaths = paths;
  next();
};
