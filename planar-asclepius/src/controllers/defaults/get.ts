import { setPlanarPathsCookie } from '@/helpers/cookie.js';
import { pathsSchema } from '@/shared/createPaths.types.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const responseOk = pathsSchema;
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/defaults',
  tags: ['defaults'],
  description: 'Cookie paths if present, otherwise asclepius.defaults.json. Plants Set-Cookie when cookie was empty',
  responses: {
    200: {
      description: 'Resolved directories',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig());

  router.get('/api/defaults', (req, res) => {
    if (!req.planarPathsFromCookie) setPlanarPathsCookie(res, req.planarPaths);

    return res.status(200).json(req.planarPaths);
  });
};
