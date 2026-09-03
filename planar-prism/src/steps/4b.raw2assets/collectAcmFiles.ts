import { readdir } from 'fs/promises';
import { join } from 'path';
import { basename } from 'path';

export type AcmFile = Readonly<{
  resourceName: string;
  absPath: string;
}>;

const walkFiles = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walkFiles(full));
    else out.push(full);
  }
  return out;
};

export const collectAcmFiles = async (musicDir: string): Promise<AcmFile[]> => {
  const files = await walkFiles(musicDir);
  return files
    .filter(path => path.toLowerCase().endsWith('.acm'))
    .map(absPath => ({
      resourceName: basename(absPath),
      absPath,
    }));
};
