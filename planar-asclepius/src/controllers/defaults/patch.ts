import validate from 'express-zod-safe';

import { setPlanarPathsCookie } from '@/helpers/cookie.js';
import { pathsSchema } from '@/shared/createPaths.types.js';

import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { Router } from 'express';

const body = pathsSchema;
const responseOk = pathsSchema;

const routeConfig = (): RouteConfig => ({
  method: 'patch',
  path: '/api/defaults',
  tags: ['defaults'],
  description: 'Set-Cookie only. Does not write asclepius.defaults.json',
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
      description: 'Cookie directories',
      content: {
        'application/json': {
          schema: responseOk,
        },
      },
    },
  },
});

export default (registry: OpenAPIRegistry, router: Router): void => {
  registry.registerPath(routeConfig());

  router.patch('/api/defaults',
    validate({ body }),
    (req, res) => {
      const paths = setPlanarPathsCookie(res, req.body);

      req.planarPaths = paths;
      req.planarPathsFromCookie = true;

      return res.status(200).json(paths);
    });
};
