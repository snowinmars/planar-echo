import validate from 'express-zod-safe';
import { z } from 'zod';

import { CLIENT_HOOKS, SERVER_HOOKS } from '@planar/shared';

import setActiveJsonMods from '@/services/mods/activeJson/set.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const body = z.object({
  slots: z.record(z.string(), z.string().nullable()),
  enabled: z.record(z.string(), z.boolean()),
  serverHooks: z.partialRecord(z.enum(SERVER_HOOKS), z.array(z.string())),
  clientHooks: z.partialRecord(z.enum(CLIENT_HOOKS), z.array(z.string())),
  queries: z.record(z.string(), z.array(z.string())),
}).openapi({
  example: {
    slots: { areaRender: 'area-render' },
    enabled: { 'area-render': true },
    serverHooks: { onTick: ['pathing-astar'] },
    clientHooks: { onFrame: ['area-render'] },
    queries: { floorOverlay: ['doors'] },
  },
});
const responseOk = z.object();
const responseError = z.object({
  errors: z.array(z.string()),
});
const routeConfig = (): RouteConfig => ({
  method: 'put',
  path: '/api/mods/activeJson',
  tags: ['mods'],
  description: 'Validate then write modsDir/active.json. No write when preview has errors',
  request: {
    body: {
      required: true,
      content: { 'application/json': { schema: body } },
    },
  },
  responses: {
    200: {
      description: 'Saved',
      content: { 'application/json': { schema: responseOk } },
    },
    400: {
      description: 'Fail-closed validation errors; disk unchanged',
      content: { 'application/json': { schema: responseError } },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig());

  router.put('/api/mods/activeJson',
    validate({ body }),
    async (req, res) => {
      const result = await setActiveJsonMods(req.planarPaths.modsRuntime.root, req.body);

      if (result.ok) return res.status(200).json({ });

      // TODO [snow]: wrong typing?
      return res.status(400).json({
        errors: result.errors,
      });
    });
};
