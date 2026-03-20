import { z } from 'zod';
import validate from 'express-zod-safe';
import action from '../../../../services/ghost/dialogue/dialogueId/skeleton/action';

import type { ZodObject, ZodString } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const registerDialogueIdParam = (registry: OpenAPIRegistry): ZodString => {
  return registry.registerParameter(
    'dialogueId',
    z.string().min(1, 'Skeleton dialogue id is required').openapi({
      param: {
        name: 'dialogueId',
        in: 'path',
        description: 'Skeleton dialogue id',
      },
      example: 'dmorte.dlg',
    }),
  );
};
const body = z.object({
  ghostDir: z.string().min(1, 'Ghost folder path is required'),
});
const responseOk = z.object({
  data: z.object({
    content: z.string(),
  }),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.int(),
  }),
});
const routeConfig = (params: ZodObject): RouteConfig => ({
  method: 'post',
  path: '/ghost/dialogue/{dialogueId}/skeleton',
  tags: ['ghostDialogue'],
  description: 'Get skeleton of the dialogue in ghost format',
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
      description: 'Dialogue skeleton content in ghost format',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'Dialogue skeleton is not found by this path',
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

  router.post('/ghost/dialogue/:dialogueId/skeleton',
    validate({ body, params: { dialogueId } }),
    async (req, res) => {
      const result = await action({
        dialogueId: req.params.dialogueId,
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
