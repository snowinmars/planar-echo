import { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import { z } from 'zod';

const responseOk = z.literal('pong');
const routeConfig: RouteConfig = {
  method: 'get',
  path: '/api/ping',
  tags: ['ping'],
  description: 'Ping',
  responses: {
    200: {
      description: 'Pong',
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

  router.get('/api/ping', (_, res) => res.status(200).json('pong'));
};

export default registerPing;
