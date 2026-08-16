import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/bcs/bcsId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerBcsIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'bcs_bcsId',
    z.string().min(1, 'Bcs id is required').openapi({
      param: {
        name: 'bcsId',
        in: 'path',
        description: 'Bcs id',
      },
      example: '0202cs2.bcs',
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
  path: '/api/ghost/bcs/{bcsId}/skeleton',
  tags: ['ghostBcs'],
  description: 'Get skeleton of the bcs in ghost format',
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
      description: 'Bcs skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Bcs is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const bcsId = registerBcsIdParam(registry);
  registry.registerPath(routeConfig(z.object({ bcsId })));

  router.post('/api/ghost/bcs/:bcsId/skeleton',
    validate({ body, params: { bcsId } }),
    async (req, res) => {
      const result = await action({
        bcsId: req.params.bcsId,
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
