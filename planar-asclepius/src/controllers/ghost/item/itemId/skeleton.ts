import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/item/itemId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerItemIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'item_itemId_skeleton',
    z.string().min(1, 'Skeleton item id is required').openapi({
      param: {
        name: 'itemId',
        in: 'path',
        description: 'Skeleton item id',
      },
      example: 'charchrm.itm',
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
  path: '/api/ghost/item/{itemId}/skeleton',
  tags: ['ghostItem'],
  description: 'Get skeleton of the item in ghost format',
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
      description: 'Item skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Item skeleton is not found by this path',
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

  router.post('/api/ghost/item/:itemId/skeleton',
    validate({ body, params: { itemId } }),
    async (req, res) => {
      const result = await action({
        itemId: req.params.itemId,
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
