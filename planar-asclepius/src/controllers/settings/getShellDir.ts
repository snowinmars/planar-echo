import { Router } from 'express';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/settings/getShell/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const responseOk = z.object({
  shellDir: z.string(),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/settings/shellDir',
  tags: ['settings'],
  description: 'Get current shell directory path settings',
  responses: {
    200: {
      description: 'Current shell directory path settings',
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

  router.get('/api/settings/shellDir',
    async (req, res) => {
      const result = await action();
      return res.status(200).json(result.data);
    });
};
