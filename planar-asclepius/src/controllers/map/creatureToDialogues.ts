import { Router } from 'express';
import validate from 'express-zod-safe';
import { z, ZodObject, ZodString } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/map/creatureToDialogues/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const registerCreatureIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'creatureToDialogues_creatureId',
    z.string().min(1, 'Creature id is required').openapi({
      param: {
        name: 'creatureId',
        in: 'path',
        description: 'Creature id',
      },
      example: 'morte.cre',
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
  path: '/api/map/creatureToDialogues/{creatureId}',
  tags: ['map'],
  description: 'Get dialogues ids for the creature id',
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
      description: 'Dialogues ids were not found for the creature id',
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

  router.get('/api/map/creatureToDialogues/:creatureId',
    validate({ params: { creatureId } }),
    async (req, res) => {
      const result = await action({
        creatureId: req.params.creatureId,
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
