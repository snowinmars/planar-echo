import { Router } from 'express';
import validate from 'express-zod-safe';
import { z, ZodObject, ZodString } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/map/itemToDialogues/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const registerItemIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'itemToDialogues_itemId',
    z.string().min(1, 'Item id is required').openapi({
      param: {
        name: 'itemId',
        in: 'path',
        description: 'Item id',
      },
      example: 'cube.itm',
    }),
  );
};

const responseOk = z.array(z.string());
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIALOGUES_NOT_FOUND']),
  }),
});
const routeConfig = (params: ZodObject): RouteConfig => ({
  method: 'get',
  path: '/api/map/itemToDialogues/{itemId}',
  tags: ['map'],
  description: 'Get dialogues ids for the item id',
  request: {
    params,
  },
  responses: {
    200: {
      description: 'Dialogues ids',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Dialogues ids were not found for the item id',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const itemId = registerItemIdParam(registry);

  registry.registerPath(routeConfig(z.object({ itemId })));

  router.get('/api/map/itemToDialogues/:itemId',
    validate({ params: { itemId } }),
    async (req, res) => {
      const result = await action({
        itemId: req.params.itemId,
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
