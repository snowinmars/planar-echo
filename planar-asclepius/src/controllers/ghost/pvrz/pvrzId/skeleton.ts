import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/pvrz/pvrzId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerPvrzIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'pvrz_pvrzId',
    z.string().min(1, 'Pvrz id is required').openapi({
      param: {
        name: 'pvrzId',
        in: 'path',
        description: 'Pvrz id',
      },
      example: 'a020301.pvrz',
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
  path: '/api/ghost/pvrz/{pvrzId}/skeleton',
  tags: ['ghostPvrz'],
  description: 'Get skeleton of the pvrz in ghost format',
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
      description: 'Pvrz skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Pvrz is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const pvrzId = registerPvrzIdParam(registry);
  registry.registerPath(routeConfig(z.object({ pvrzId })));

  router.post('/api/ghost/pvrz/:pvrzId/skeleton',
    validate({ body, params: { pvrzId } }),
    async (req, res) => {
      const result = await action({
        pvrzId: req.params.pvrzId,
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
