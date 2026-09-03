import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/map/creToDlgs/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerCreIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'creToDlgs_creId',
    z.string().min(1, 'Cre id is required').openapi({
      param: {
        name: 'creId',
        in: 'path',
        description: 'Cre id',
      },
      example: 'morte.cre',
    }),
  );
};

const responseOk = z.array(z.string());
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DLGS_NOT_FOUND']),
  }),
});
const routeConfig = (params: ZodObject): RouteConfig => ({
  method: 'get',
  path: '/api/map/creToDlgs/{creId}',
  tags: ['map'],
  description: 'Get dlgs ids for the cre id',
  request: {
    params,
  },
  responses: {
    200: {
      description: 'Dlgs ids',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Dlgs ids were not found for the cre id',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const creId = registerCreIdParam(registry);

  registry.registerPath(routeConfig(z.object({ creId })));

  router.get('/api/map/creToDlgs/:creId',
    validate({ params: { creId } }),
    async (req, res) => {
      const result = await action({
        creId: req.params.creId,
      });

      if (result.ok) {
        return res.status(200).json(result.data);
      }

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
