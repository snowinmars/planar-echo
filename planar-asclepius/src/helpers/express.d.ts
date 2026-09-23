import type { Paths } from '@/shared/createPaths.types.ts';

declare module 'express-serve-static-core' {
  interface Request {
    planarPaths: Paths;
    planarPathsFromCookie: boolean;
  }
}
