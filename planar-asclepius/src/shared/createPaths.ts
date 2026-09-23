import { existsSync } from 'fs';
import { join } from 'path';

import { ownPackageRoot, packageDir } from '@planar/shared/node';

import type { Paths } from './createPaths.types.js';

const importer = import.meta.url;

type HasRoot = Readonly<{ root: string }>;
type HasDist = Readonly<{ dist: string }>;

const hasRoot = (root: string): HasRoot => {
  if (!existsSync(root)) throw new Error(`Directory '${root}' does not exists`);

  return {
    root,
  };
};

const hasDist = (root: string): HasRoot & HasDist => {
  const r = hasRoot(root);

  return {
    root: r.root,
    dist: join(root, 'dist'), // dist may not exist
  };
};

/* eslint-disable @stylistic/no-multi-spaces */
const asclepius   = hasDist(ownPackageRoot(importer, '@planar/asclepius'));
const repository  = hasRoot(join(asclepius.root, '..'));
const daemon      = hasDist(packageDir('@planar/daemon', importer));
const ghost       = hasRoot(join(repository.root, 'planar-ghost'));
const kernel      = hasDist(packageDir('@planar/kernel', importer));
const mods        = hasDist(packageDir('@planar/mods', importer));
const modsRuntime = hasRoot(join(repository.root, 'planar-mods-runtime'));
const prism       = hasDist(packageDir('@planar/prism', importer));
const shared      = hasDist(packageDir('@planar/shared', importer));
const shell       = hasDist(packageDir('@planar/shell', importer));
const weidu       = hasRoot(join(repository.root, 'planar-weidu'));
/* eslint-enable */

export const createPaths = (): Paths => ({
  asclepius: {
    ...asclepius,
    defaultsJson: join(asclepius.root, 'asclepius.defaults.json'),
  },
  repository,
  daemon,
  ghost,
  kernel,
  mods,
  modsRuntime,
  prism: {
    ...prism,
    defaultsJson: (prism.root, 'prism.defaults.json'),
  },
  shared,
  shell,
  weidu,
});
