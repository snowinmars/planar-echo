import { Router } from 'express';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/settings/getGhost/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const responseOk = z.object({
  ghostDir: z.string(),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/settings/ghostDir',
  tags: ['settings'],
  description: 'Get current ghost directory path settings',
  responses: {
    200: {
      description: 'Current ghost directory path settings',
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

  router.get('/api/settings/ghostDir',
    async (req, res) => {
      const result = await action();
      return res.status(200).json(result.data);
    });
};
