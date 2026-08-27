import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { nothing, type Maybe } from './maybe.js';

type PackageNameField = Readonly<{
  name?: string;
}>;

const dirOf = (from: string | URL): string => {
  const isUrl = from instanceof URL;
  if (isUrl) return dirname(fileURLToPath(from));

  const isFileUrl = from.startsWith('file:');
  if (isFileUrl) return dirname(fileURLToPath(from));

  return dirname(from);
};

const packageNameAt = (dir: string): Maybe<string> => {
  const pkgPath = join(dir, 'package.json');
  const missing = !existsSync(pkgPath);
  if (missing) return nothing();

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as PackageNameField;
  return pkg.name;
};

export const ownPackageRoot = (from: string | URL, packageName: string): string => {
  let dir = dirOf(from);

  for (;;) {
    const found = packageNameAt(dir) === packageName;
    if (found) return dir;

    const parent = dirname(dir);
    const atFilesystemRoot = parent === dir;
    if (atFilesystemRoot) throw new Error(`Package '${packageName}' was not found walking up from '${String(from)}'`);

    dir = parent;
  }
};
