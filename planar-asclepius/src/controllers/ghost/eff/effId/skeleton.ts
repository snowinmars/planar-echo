import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/eff/effId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerEffIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'eff_effId',
    z.string().min(1, 'Eff id is required').openapi({
      param: {
        name: 'effId',
        in: 'path',
        description: 'Eff id',
      },
      example: 'spin103.eff',
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
  path: '/api/ghost/eff/{effId}/skeleton',
  tags: ['ghostEff'],
  description: 'Get skeleton of the eff in ghost format',
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
      description: 'Eff skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Eff is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const effId = registerEffIdParam(registry);
  registry.registerPath(routeConfig(z.object({ effId })));

  router.post('/api/ghost/eff/:effId/skeleton',
    validate({ body, params: { effId } }),
    async (req, res) => {
      const result = await action({
        effId: req.params.effId,
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
