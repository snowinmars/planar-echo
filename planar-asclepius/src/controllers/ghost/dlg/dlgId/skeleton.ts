import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/ghost/dlg/dlgId/skeleton/action.js';

import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
import type { ZodObject, ZodString } from 'zod';

const registerDlgIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'dlg_dlgId_skeleton',
    z.string().min(1, 'Skeleton dlg id is required').openapi({
      param: {
        name: 'dlgId',
        in: 'path',
        description: 'Skeleton dlg id',
      },
      example: 'dmorte1.dlg',
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
  method: 'post', // because I have to pass ghostDir
  path: '/api/ghost/dlg/{dlgId}/skeleton',
  tags: ['ghostDlg'],
  description: 'Get skeleton of the dlg in ghost format',
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
      description: 'Dlg skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Dlg skeleton is not found by this path',
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

  router.post('/api/ghost/dlg/:dlgId/skeleton',
    validate({ body, params: { dlgId } }),
    async (req, res) => {
      const result = await action({
        dlgId: req.params.dlgId,
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
