import validate from 'express-zod-safe';
import { z } from 'zod';

import action from '@/services/fs/download/weidu/action.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const weiduPlatforms = ['windows', 'linux', 'mac'] as const;

const body = z.object({
  platform: z.enum(weiduPlatforms),
});
const responseOk = z.object({
  data: z.object({
    weiduExeDir: z.string(),
  }),
});
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['DOWNLOAD_FAILED', 'EXTRACT_FAILED', 'BINARY_NOT_FOUND']),
  }),
});
const routeConfig = (): RouteConfig => ({
  method: 'post',
  path: '/api/fs/download/weidu',
  tags: ['fs'],
  description: 'Downloads WeiDU from GitHub into planar-weidu and returns the binary path',
  request: {
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
      description: 'Path to the WeiDU binary',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    404: {
      description: 'WeiDU binary not found in archive',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
    500: {
      description: 'Failed to extract WeiDU',
      content: {
        'application/json': {
          schema: responseError,
        },
      },
    },
    502: {
      description: 'Failed to download WeiDU',
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

  router.post('/api/fs/download/weidu',
    validate({ body }),
    async (req, res) => {
      const result = await action({
        platform: req.body.platform.toLowerCase() as typeof weiduPlatforms[number],
      });

      if (result.ok) {
        return res.status(200).json({
          data: {
            weiduExeDir: result.data.weiduExeDir,
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
