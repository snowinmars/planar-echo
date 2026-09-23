import { z } from 'zod';

import { CLIENT_HOOKS, SERVER_HOOKS } from '@planar/shared';

import getActiveJsonMods from '@/services/mods/activeJson/get.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';
const responseOk = z.object({
  slots: z.record(z.string(), z.string().nullable()),
  enabled: z.record(z.string(), z.boolean()),
  serverHooks: z.partialRecord(z.enum(SERVER_HOOKS), z.array(z.string())),
  clientHooks: z.partialRecord(z.enum(CLIENT_HOOKS), z.array(z.string())),
  queries: z.record(z.string(), z.array(z.string())),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/mods/activeJson',
  tags: ['mods'],
  description: 'Read modsDir/active.json',
  responses: {
    200: {
      description: 'active.json',
      content: { 'application/json': { schema: responseOk } },
    },
    404: {
      description: 'active.json missing',
      content: { 'application/json': { schema: responseError } },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig());

  router.get('/api/mods/activeJson', async (req, res) => {
    const result = await getActiveJsonMods(req.planarPaths.modsRuntime.root);

    if (result.ok) return res.status(200).json(result.data);

    return res.status(result.error.status).json({
      error: {
        message: result.error.message,
        code: result.error.code,
      },
    });
  });
};
