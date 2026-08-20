import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/ini/iniId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerIniIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'ini_iniId',
    z.string().min(1, 'Ini id is required').openapi({
      param: {
        name: 'iniId',
        in: 'path',
        description: 'Ini id',
      },
      example: 'ar0202.ini',
    }),
  );
};
const body = z.object({
  ghostDir: z.string().min(1, 'Ghost directory path is required'),
});
const responseOk = z.object({
  data: z.object({
    content: z.string(),
  }),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['FILE_NOT_FOUND']),
  }),
});
const routeConfig = (params: ZodObject): RouteConfig => ({
  method: 'post',
  path: '/api/ghost/ini/{iniId}/skeleton',
  tags: ['ghostIni'],
  description: 'Get skeleton of the ini in ghost format',
  request: {
    params,
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
      description: 'Ini skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Ini is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const iniId = registerIniIdParam(registry);
  registry.registerPath(routeConfig(z.object({ iniId })));

  router.post('/api/ghost/ini/:iniId/skeleton',
    validate({ body, params: { iniId } }),
    async (req, res) => {
      const result = await action({
        iniId: req.params.iniId,
        ghostDir: req.body.ghostDir,
      });

      if (result.ok) {
        return res.status(200).json({
          data: {
            content: result.data.content,
          },
        });
      }

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
