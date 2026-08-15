import { Router } from 'express';
import validate from 'express-zod-safe';
import { z, ZodObject, ZodString } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/map/dlgToCres/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const registerDlgIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'dlgToCre_dlgId',
    z.string().min(1, 'Dlg id is required').openapi({
      param: {
        name: 'dlgId',
        in: 'path',
        description: 'Dlg id',
      },
      example: 'dmorte1.dlg',
    }),
  );
};

const responseOk = z.array(z.string());
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['CRE_NOT_FOUND']),
  }),
});
const routeConfig = (params: ZodObject): RouteConfig => ({
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
  const dlgId = registerDlgIdParam(registry);

  registry.registerPath(routeConfig(z.object({ dlgId })));

  router.get('/api/map/dlgToCres/:dlgId',
    validate({ params: { dlgId } }),
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
