import { Router } from 'express';
import validate from 'express-zod-safe';
import { z, ZodObject, ZodString } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/map/dialogueToItem/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const registerDialogueIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'dialogueToItem_dialogueId',
    z.string().min(1, 'Dialogue id is required').openapi({
      param: {
        name: 'dialogueId',
        in: 'path',
        description: 'Dialogue id',
      },
      example: 'dcube.dlg',
    }),
  );
};

const responseOk = z.array(z.string());
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['ITEM_NOT_FOUND']),
  }),
});
const routeConfig = (params: ZodObject): RouteConfig => ({
  method: 'get',
  path: '/api/map/dialogueToItem/{dialogueId}',
  tags: ['map'],
  description: 'Get item id for the dialogue id',
  request: {
    params,
  },
  responses: {
    200: {
      description: 'Item id',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Item id were not found for this dialogue id',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const dialogueId = registerDialogueIdParam(registry);

  registry.registerPath(routeConfig(z.object({ dialogueId })));

  router.get('/api/map/dialogueToItem/:dialogueId',
    validate({ params: { dialogueId } }),
    async (req, res) => {
      const result = await action({
        dialogueId: req.params.dialogueId,
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
