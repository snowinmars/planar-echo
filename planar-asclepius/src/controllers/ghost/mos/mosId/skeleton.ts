import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/mos/mosId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerMosIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'mos_mosId',
    z.string().min(1, 'Mos id is required').openapi({
      param: {
        name: 'mosId',
        in: 'path',
        description: 'Mos id',
      },
      example: 'ar0202.mos',
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
  path: '/api/ghost/mos/{mosId}/skeleton',
  tags: ['ghostMos'],
  description: 'Get skeleton of the mos in ghost format',
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
      description: 'Mos skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Mos is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const mosId = registerMosIdParam(registry);
  registry.registerPath(routeConfig(z.object({ mosId })));

  router.post('/api/ghost/mos/:mosId/skeleton',
    validate({ body, params: { mosId } }),
    async (req, res) => {
      const result = await action({
        mosId: req.params.mosId,
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
