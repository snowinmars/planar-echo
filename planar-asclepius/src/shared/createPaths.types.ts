import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const rootSchema = z.object({
  root: z.string().min(1),
});

const distSchema = rootSchema.extend({
  dist: z.string().min(1),
});

const distSchemaWithDefaultJson = distSchema.extend({
  defaultsJson: z.string().min(1),
});

const absRoot = (pkg: string) => `/abs/${pkg}`;
const absDist = (pkg: string) => `/abs/${pkg}/dist`;
const absDefaultsJson = (pkg: string) => `/abs/${pkg}/asclepius.defaults.json`;

export const pathsSchema = z.object({
  asclepius: distSchemaWithDefaultJson,
  repository: rootSchema,
  daemon: distSchema,
  ghost: rootSchema,
  kernel: distSchema,
  mods: distSchema,
  modsRuntime: rootSchema,
  prism: distSchemaWithDefaultJson,
  shared: distSchema,
  shell: distSchema,
  weidu: rootSchema,
}).openapi({
  example: {
    asclepius: { root: absRoot('asclepius'), dist: absDist('asclepius'), defaultsJson: absDefaultsJson('asclepius') },
    repository: { root: absRoot('repository') },
    daemon: { root: absRoot('daemon'), dist: absDist('daemon') },
    ghost: { root: absRoot('ghost') },
    kernel: { root: absRoot('kernel'), dist: absDist('kernel') },
    mods: { root: absRoot('mods'), dist: absDist('mods') },
    modsRuntime: { root: absRoot('modsRuntime') },
    prism: { root: absRoot('prism'), dist: absDist('prism'), defaultsJson: absDefaultsJson('prism') },
    shared: { root: absRoot('shared'), dist: absDist('shared') },
    shell: { root: absRoot('shell'), dist: absDist('shell') },
    weidu: { root: absRoot('weidu') },
  },
});

export type Paths = z.infer<typeof pathsSchema>;
