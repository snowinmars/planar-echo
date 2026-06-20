const { build } = require('esbuild');
const path = require('path');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.js',
  alias: { '@planar/shared': path.join(__dirname, '..', '..', '..', 'node_modules', '@planar', 'shared', 'dist') },
  // external: ['pg-native', 'bufferutil', 'utf-8-validate'],
  loader: { '.ts': 'ts' },
  resolveExtensions: ['.ts', '.js']
}).catch(e => console.error(e));
