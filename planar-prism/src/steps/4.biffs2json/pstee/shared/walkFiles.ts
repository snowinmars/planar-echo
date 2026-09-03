import { readdir } from 'fs/promises';
import { join } from 'path';

export const walkFiles = async (dir: string): Promise<string[]> => {
  const out: string[] = [];

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walkFiles(full));
    else out.push(full);
  }

  return out;
};
