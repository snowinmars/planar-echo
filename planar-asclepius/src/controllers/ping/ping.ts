import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const responseOk = z.literal('pong asclepius');
const routeConfig: RouteConfig = {
  method: 'get',
  path: '/api/ping',
  tags: ['ping'],
  description: 'Ping',
  responses: {
    200: {
      description: 'pong asclepius',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
  },
};

const registerPing = (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig);

  router.get('/api/ping', (_, res) => res.status(200).json('pong asclepius'));
};

export default registerPing;
