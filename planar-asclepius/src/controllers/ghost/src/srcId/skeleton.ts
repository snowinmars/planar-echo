import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/src/srcId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerSrcIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'src_srcId',
    z.string().min(1, 'Src id is required').openapi({
      param: {
        name: 'srcId',
        in: 'path',
        description: 'Src id',
      },
      example: '0502supe.src',
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
  path: '/api/ghost/src/{srcId}/skeleton',
  tags: ['ghostSrc'],
  description: 'Get skeleton of the src in ghost format',
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
      description: 'Src skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Src is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const srcId = registerSrcIdParam(registry);
  registry.registerPath(routeConfig(z.object({ srcId })));

  router.post('/api/ghost/src/:srcId/skeleton',
    validate({ body, params: { srcId } }),
    async (req, res) => {
      const result = await action({
        srcId: req.params.srcId,
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
