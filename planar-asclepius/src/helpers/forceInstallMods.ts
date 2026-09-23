import { cp, readdir, rm } from 'fs/promises';
import { join } from 'path';

export const forceInstallMods = async (from: string, to: string): Promise<string[]> => {
  const copied: string[] = [];

  const entries = await readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    const isDir = entry.isDirectory();
    if (!isDir) continue;

    const dest = join(to, entry.name);
    await rm(dest, { recursive: true, force: true });
    await cp(join(from, entry.name), dest, { recursive: true });

    copied.push(entry.name);
  }

  return copied;
};
