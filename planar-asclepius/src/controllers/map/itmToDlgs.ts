import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/map/itmToDlgs/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const params = z.object({
  itmId: z.string().min(1, 'Itm id is required').openapi({
    example: 'cube.itm',
  }),
});
const responseOk = z.array(z.string());
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DLGS_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/map/itmToDlgs/{itmId}',
  tags: ['map'],
  description: 'Get dlgs ids for the itm id',
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
      description: 'Dlgs ids were not found for the itm id',
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

  router.get('/api/map/itmToDlgs/:itmId',
    validate({ params }),
    async (req, res) => {
      const result = await action({
        itmId: req.params.itmId,
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
