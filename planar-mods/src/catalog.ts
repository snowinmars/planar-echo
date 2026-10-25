import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isRecord } from '@planar/shared';

// TODO [snow]: supporn upper slashes
const CONTRACT_EXPORT = /^\.\/([^/]+)\/contract$/; // ./conformance/contract
const SERVER_EXPORT = /^\.\/([^/]+)\/server$/; // ./conformance/server

const packageJsonPath = (): string => {
  const initDir = dirname(fileURLToPath(import.meta.url));

  let dir = initDir;
  while (true) {
    const candidate = join(dir, 'package.json');

    if (existsSync(candidate)) {
      const parsed: unknown = JSON.parse(readFileSync(candidate, 'utf8'));
      if (isRecord(parsed) && parsed.name === '@planar/mods') return candidate;
    }

    const parent = dirname(dir);
    if (parent === dir) throw new Error('Mods package root was not found');
    dir = parent;
  }
};

const exportNames = (keys: string[], pattern: RegExp): Set<string> => {
  const names = new Set<string>();

  for (const key of keys) {
    const name = pattern.exec(key)?.[1];
    if (name) names.add(name);
  }

  return names;
};

export type ModDescriptor = Readonly<{
  contractSpecifier: string;
  serverSpecifier: string;
}>;

export const readModCatalog = (): ModDescriptor[] => {
  const packageJson: unknown = JSON.parse(readFileSync(packageJsonPath(), 'utf8'));
  if (!isRecord(packageJson) || !isRecord(packageJson.exports)) throw new Error('Mods package has no exports');

  const keys = Object.keys(packageJson.exports);
  const contracts = exportNames(keys, CONTRACT_EXPORT);
  const servers = exportNames(keys, SERVER_EXPORT);
  const names = [...new Set([...contracts, ...servers])].sort();

  const descriptors: ModDescriptor[] = [];
  for (const name of names) {
    descriptors.push({
      contractSpecifier: `@planar/mods/${name}/contract`,
      serverSpecifier: `@planar/mods/${name}/server`,
    });
  }

  return descriptors;
};
