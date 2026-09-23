import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { build } from 'esbuild';

const root = dirname(fileURLToPath(import.meta.url));
const distRoot = join(root, 'dist');

const mods = [
  { id: 'area-render', client: true, server: false },
  { id: 'actor-render', client: true, server: false },
  { id: 'pathing-astar', client: false, server: true },
  { id: 'populate', client: false, server: true },
  { id: 'travel', client: false, server: true },
  { id: 'doors', client: true, server: true },
  { id: 'collision', client: true, server: true },
  { id: 'paint-cell', client: true, server: false },
];

mkdirSync(distRoot, { recursive: true });

const factorySrc = join(root, 'factory-active.json');
cpSync(factorySrc, join(distRoot, 'factory-active.json'));

for (const mod of mods) {
  const srcDir = join(root, mod.id);
  const outDir = join(distRoot, mod.id);
  mkdirSync(outDir, { recursive: true });
  const manifest = readFileSync(join(srcDir, 'mod.json'), 'utf8');
  writeFileSync(join(outDir, 'mod.json'), manifest);

  if (mod.server) {
    await build({
      absWorkingDir: root,
      entryPoints: [join(srcDir, 'src', 'server.ts')],
      outfile: join(outDir, 'server.js'),
      bundle: true,
      format: 'esm',
      platform: 'node',
      target: 'node20',
      sourcemap: false,
    });
  }

  if (mod.client) {
    await build({
      absWorkingDir: root,
      entryPoints: [join(srcDir, 'src', 'client.ts')],
      outfile: join(outDir, 'client.js'),
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      sourcemap: false,
    });
  }
}
