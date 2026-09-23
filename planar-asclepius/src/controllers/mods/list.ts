import { z } from 'zod';

import action from '@/services/mods/list/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const responseOk = z.object({
  modsDir: z.string(),
  mods: z.array(z.object({
    manifests: z.array(z.object({
      id: z.string(),
      version: z.string(),
      sides: z.array(z.enum([
        'client',
        'server',
      ])),
      slots: z.array(z.enum([
        'actorRender',
        'areaRender',
        'pathing',
        'populate',
        'travel',
      ])),
      hooks: z.array(z.enum([
        'onAreaLoad',
        'onCommand',
        'onTick',
        'onPatches',
        'onFrame',
      ])),
      requiredModIds: z.array(z.string()),
    })),
  })),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DIRECTORY_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/mods',
  tags: ['mods'],
  description: 'List installed mods in modsDir',
  responses: {
    200: {
      description: 'Mods on disk',
      content: { 'application/json': { schema: responseOk } },
    },
    404: {
      description: 'modsDir missing',
      content: { 'application/json': { schema: responseError } },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig());

  router.get('/api/mods', async (req, res) => {
    const result = await action(req.planarPaths.modsRuntime.root);

    if (result.ok) return res.status(200).json(result.data);

    return res.status(result.error.status).json({
      error: {
        message: result.error.message,
        code: result.error.code,
      },
    });
  });
};
