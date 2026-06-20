import { Router } from 'express';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/settings/getPrism/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const responseOk = z.object({
  prismDir: z.string(),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/settings/prismDir',
  tags: ['settings'],
  description: 'Get current prism directory path settings',
  responses: {
    200: {
      description: 'Current prism directory path settings',
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

  router.get('/api/settings/prismDir',
    async (req, res) => {
      const result = await action();
      return res.status(200).json(result.data);
    });
};
