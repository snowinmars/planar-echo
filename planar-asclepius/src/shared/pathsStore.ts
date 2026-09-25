import { existsSync, mkdirSync, readFileSync } from 'fs';

import { pathsSchema } from './createPaths.types.js';

import type { Paths } from './createPaths.types.js';

const missingRoot = (dir: string): string => `Directory '${dir}' does not exist`;

const missingDist = (dir: string): string => `Directory '${dir}' does not exist. Run 'yarn build' then restart.`;

const requireDir = (dir: string, message: (dir: string) => string): void => {
  if (!existsSync(dir)) throw new Error(message(dir));
};

const ensureDir = (dir: string): void => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

export const loadPaths = (filePath: string): Paths => {
  if (!existsSync(filePath)) throw new Error(`Paths file is missing: '${filePath}'. Copy asclepius.defaults.example.json to that path.`);

  const raw = readFileSync(filePath, { encoding: 'utf8' });
  const parsed = JSON.parse(raw);
  const paths = pathsSchema.parse(parsed);

  requireDir(paths.repository.root, missingRoot);
  requireDir(paths.asclepius.root, missingRoot);
  requireDir(paths.daemon.root, missingRoot);
  requireDir(paths.kernel.root, missingRoot);
  requireDir(paths.mods.root, missingRoot);
  requireDir(paths.prism.root, missingRoot);
  requireDir(paths.shared.root, missingRoot);
  requireDir(paths.shell.root, missingRoot);

  requireDir(paths.asclepius.dist, missingDist);
  requireDir(paths.daemon.dist, missingDist);
  requireDir(paths.kernel.dist, missingDist);
  requireDir(paths.mods.dist, missingDist);
  requireDir(paths.prism.dist, missingDist);
  requireDir(paths.shared.dist, missingDist);
  requireDir(paths.shell.dist, missingDist);

  ensureDir(paths.ghost.root);
  ensureDir(paths.weidu.root);
  ensureDir(paths.modsRuntime.root);

  return paths;
};
