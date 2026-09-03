import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/map/dlgToItms/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerDlgIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'dlgToItm_dlgId',
    z.string().min(1, 'Dlg id is required').openapi({
      param: {
        name: 'dlgId',
        in: 'path',
        description: 'Dlg id',
      },
      example: 'dcube.dlg',
    }),
  );
};

const responseOk = z.array(z.string());
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['ITM_NOT_FOUND']),
  }),
});
const routeConfig = (params: ZodObject): RouteConfig => ({
  method: 'get',
  path: '/api/map/dlgToItms/{dlgId}',
  tags: ['map'],
  description: 'Get itm id for the dlg id',
  request: {
    params,
  },
  responses: {
    200: {
      description: 'Itm id',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Itm id were not found for this dlg id',
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

  router.get('/api/map/dlgToItms/:dlgId',
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
