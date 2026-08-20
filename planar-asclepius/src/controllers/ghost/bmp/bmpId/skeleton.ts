import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/bmp/bmpId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerBmpIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'bmp_bmpId',
    z.string().min(1, 'Bmp id is required').openapi({
      param: {
        name: 'bmpId',
        in: 'path',
        description: 'Bmp id',
      },
      example: 'ampnm1.bmp',
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
  path: '/api/ghost/bmp/{bmpId}/skeleton',
  tags: ['ghostBmp'],
  description: 'Get skeleton of the bmp in ghost format',
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
      description: 'Bmp skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Bmp is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const bmpId = registerBmpIdParam(registry);
  registry.registerPath(routeConfig(z.object({ bmpId })));

  router.post('/api/ghost/bmp/:bmpId/skeleton',
    validate({ body, params: { bmpId } }),
    async (req, res) => {
      const result = await action({
        bmpId: req.params.bmpId,
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
