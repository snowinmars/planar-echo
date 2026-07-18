import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const noCheckHeader = '/* eslint-disable */\n// @ts-nocheck\n';

const addHeader = async (file) => {
  const source = await readFile(file, 'utf8');

  if (!source.startsWith(noCheckHeader)) {
    await writeFile(file, `${noCheckHeader}${source}`);
  }
};

const addHeaders = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return addHeaders(path);
      }

      return entry.isFile() && path.endsWith('.ts') ? addHeader(path) : undefined;
    }),
  );
};

await addHeaders(fileURLToPath(new URL('../swagger/client/', import.meta.url)));
