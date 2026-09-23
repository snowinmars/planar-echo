import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/map/dlgToCres/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const params = z.object({
  dlgId: z.string().min(1, 'Dlg id is required').openapi({
    example: 'dmorte1.dlg',
  }),
});
const responseOk = z.array(z.string());
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['CRE_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/map/dlgToCres/{dlgId}',
  tags: ['map'],
  description: 'Get cre id for the dlg id',
  request: {
    params,
  },
  responses: {
    200: {
      description: 'Cre id',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Cre id were not found for this dlg id',
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

  router.get('/api/map/dlgToCres/:dlgId',
    validate({ params }),
    async (req, res) => {
      const result = await action({
        dlgId: req.params.dlgId,
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
