import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '@/services/ghost/creature/creatureId/skeleton/action.js';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerCreatureIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'creatureId',
    z.string().min(1, 'Skeleton creature id is required').openapi({
      param: {
        name: 'creatureId',
        in: 'path',
        description: 'Skeleton creature id',
      },
      example: 'morte',
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
  path: '/api/ghost/creature/{creatureId}/skeleton',
  tags: ['ghostCreature'],
  description: 'Get skeleton of the creature in ghost format',
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
      description: 'Creature skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Creature skeleton is not found by this path',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  const creatureId = registerCreatureIdParam(registry);
  registry.registerPath(routeConfig(z.object({ creatureId })));

  router.post('/api/ghost/creature/:creatureId/skeleton',
    validate({ body, params: { creatureId } }),
    async (req, res) => {
      const result = await action({
        creatureId: req.params.creatureId,
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
