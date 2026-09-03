import { createRequire } from 'module';

import { ownPackageRoot } from './ownPackageRoot.js';

export const packageDir = (packageName: string, importer: string | URL): string => ownPackageRoot(createRequire(importer).resolve(packageName), packageName);
