import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/wed/wedId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerWedIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'wed_wedId',
    z.string().min(1, 'Wed id is required').openapi({
      param: {
        name: 'wedId',
        in: 'path',
        description: 'Wed id',
      },
      example: 'ar0202.wed',
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
  path: '/api/ghost/wed/{wedId}/skeleton',
  tags: ['ghostWed'],
  description: 'Get skeleton of the wed in ghost format',
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
      description: 'Wed skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Wed is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const wedId = registerWedIdParam(registry);
  registry.registerPath(routeConfig(z.object({ wedId })));

  router.post('/api/ghost/wed/:wedId/skeleton',
    validate({ body, params: { wedId } }),
    async (req, res) => {
      const result = await action({
        wedId: req.params.wedId,
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
