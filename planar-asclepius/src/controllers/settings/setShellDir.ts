import { Router } from 'express';
import validate from 'express-zod-safe';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/settings/setShell/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const body = z.object({
  shellDir: z.string().min(1, 'Shell directory path is required'),
});
const responseOk = z.object({
  shellDir: z.string(),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIRECTORY_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'post',
  path: '/api/settings/shellDir',
  tags: ['settings'],
  description: 'Set current shell directory path settings',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Current shell directory path settings',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'No such directory for shell directory',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig());

  router.post('/api/settings/shellDir',
    validate({ body }),
    async (req, res) => {
      const result = await action({ shellDir: req.body.shellDir });

      if (result.ok) return res.status(200).json(result.data);

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
