import validate from 'express-zod-safe';
import { z } from 'zod';

import { setPlanarPathsCookie } from '@/helpers/cookie.js';
import { pathsSchema } from '@/shared/createPaths.types.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

import type { PathsStore } from '@/shared/pathsStore.js';

const body = pathsSchema;
const responseOk = pathsSchema;
const responseError = z.object({
  error: z.object({
    message: z.string(),
    code: z.enum(['WRITE_FAILED']),
  }),
});

const routeConfig = (): RouteConfig => ({
  method: 'put',
  path: '/api/defaults',
  tags: ['defaults'],
  description: 'Write asclepius.defaults.json and Set-Cookie',
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
      description: 'Saved directories',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
    500: {
      description: 'Failed to write json',
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

  router.put('/api/defaults',
    validate({ body }),
    async (req, res) => {
      const store = req.app.get('paths') as PathsStore;

      try {
        const paths = await store.save(req.body);
        setPlanarPathsCookie(res, paths);

        req.planarPaths = paths;
        req.planarPathsFromCookie = true;

        return res.status(200).json(paths);
      }
      catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);

        return res.status(500).json({
          error: {
            message,
            code: 'WRITE_FAILED',
          },
        });
      }
    });
};
