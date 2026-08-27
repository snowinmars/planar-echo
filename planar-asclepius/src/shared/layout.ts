import { createRequire } from 'module';
import { join } from 'path';
import { ownPackageRoot, packageDir } from '@planar/shared/node';

const importer = import.meta.url;
const nodeRequire = createRequire(importer);

const asclepiusRoot = ownPackageRoot(importer, '@planar/asclepius');
const repoRoot = join(asclepiusRoot, '..');

export const defaultShellDir = join(packageDir('@planar/shell', importer), 'dist');
export const defaultPrismDir = join(packageDir('@planar/prism', importer), 'dist');
export const defaultGhostDir = join(repoRoot, 'planar-ghost');
export const defaultWeiduDir = join(repoRoot, 'planar-weidu');

export const defaultDaemonEntry = (): string => nodeRequire.resolve('@planar/daemon');
export const defaultDaemonCwd = (): string => packageDir('@planar/daemon', importer);
