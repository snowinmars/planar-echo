import { Router } from 'express';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import action from '@/services/fs/prismDir/action.js';

import type { RouteConfig } from '@asteasolutions/zod-to-openapi';

const responseOk = z.string();
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['FILE_NOT_FOUND', 'DIRECTORY_TRAVERSE']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'get',
  path: '/api/fs/prismDir/{filePath}',
  tags: ['fs'],
  description: 'Get file content from prism directory by relative path',
  parameters: [
    {
      in: 'path',
      name: 'filePath',
      required: true,
      schema: { type: 'string' },
      description: 'Relative path to the file relative to prism directory, can include lower slashes',
    },
  ],
  responses: {
    200: {
      description: 'File content from prism directory',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    403: {
      description: 'Forbidden relative path in the prism directory',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
    404: {
      description: 'No such file in the prism directory',
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

  router.get('/api/fs/prismDir/:filePath',
    async (req, res) => {
      // changing this code change index.ts middleware
      const { filePath } = req.params;
      const result = await action({ path: filePath });

      if (result.ok) return res.status(200).sendFile(result.data.fullPath);

      return res.status(result.error.status).json({
        error: {
          message: result.error.message,
          code: result.error.code,
        },
      });
    });
};
