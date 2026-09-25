import { pathsSchema } from '@/shared/createPaths.types.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const responseOk = pathsSchema;
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/paths',
  tags: ['paths'],
  description: 'Returns frozen paths snapshot, loaded at process start',
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

  router.get('/api/paths', (req, res) => {
    return res.status(200).json(req.planarPaths);
  });
};
