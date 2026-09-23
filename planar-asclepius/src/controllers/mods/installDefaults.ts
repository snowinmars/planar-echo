import { mkdir } from 'fs/promises';
import { z } from 'zod';

import { fileExists } from '@planar/shared/node';

import { createActiveJsonIfMissing } from '@/helpers/seedModsRuntime.js';
import { installDefaults } from '@/services/mods/installDefaults/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const responseOk = z.object({
  copied: z.array(z.string()),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['FILE_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'post',
  path: '/api/mods/install-defaults',
  tags: ['mods'],
  description: 'Build planar-mods, then force-copy dist folders into modsDir. Does not overwrite active.json',
  responses: {
    200: {
      description: 'Copied mods ids',
      content: { 'application/json': { schema: responseOk } },
    },
    500: {
      description: 'Yarn build failed; no copy',
      content: { 'application/json': { schema: responseError } },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig());

  router.post('/api/mods/install-defaults', async (req, res) => {
    const modsDir = req.planarPaths.modsRuntime.root;
    const modsDist = req.planarPaths.mods.dist;

    await mkdir(modsDir, { recursive: true });

    const foundDist = await fileExists(modsDist);
    if (!foundDist) throw new Error(`Source mods folder '${modsDist}' does not exists`);

    const result = await installDefaults(modsDist, modsDir);

    if (result.ok) {
      await createActiveJsonIfMissing(modsDir, modsDist);
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
