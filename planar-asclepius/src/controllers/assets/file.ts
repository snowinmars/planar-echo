import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import action from '@/services/assets/file/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

extendZodWithOpenApi(z); // TODO [snow]: it should be executed in the first controller, but I just know, that this controller is the first.

const params = z.object({
  filePath: z.string().min(1).openapi({
    example: 'are/ar0202.png',
    description: 'Relative path to the file in assets directory',
  }),
});
const responseOk = z.string();
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['FILE_NOT_FOUND', 'DIRECTORY_TRAVERSE']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/assets/{filePath}',
  tags: ['assets'],
  description: 'Get file content from ghost assets directory by relative path',
  request: {
    params,
  },
  responses: {
    200: {
      description: 'File content from assets directory',
      content: {
        'application/octet-stream': {
          schema: responseOk,
        },
      },
    },
    403: {
      description: 'Forbidden relative path in the assets directory',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
    404: {
      description: 'No such file in the assets directory',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig());

  router.get('/api/assets/:filePath',
    async (req, res) => {
      const { filePath } = req.params;
      const result = await action({ path: filePath, ghostDir: req.planarPaths.ghost.root });

      if (result.ok) return res.status(200).sendFile(result.data.fullPath);

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
