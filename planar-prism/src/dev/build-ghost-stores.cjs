const { readdirSync } = require('fs');
const { build } = require('esbuild');
const path = require('path');

const srcDir = path.join(__dirname, '..', '..', '..', 'planar-ghost', 'ghost', 'stores');
const files = readdirSync(srcDir).filter(f => f.endsWith('.ts')).map(f => path.join(srcDir, f));

build({
  entryPoints: files,
  outdir: path.join(srcDir, 'dist'),
  alias: { '@planar/shared': path.join(__dirname, '..', '..', '..', 'node_modules', '@planar/shared') },
  platform: 'browser',
  target: 'es2020',
  bundle: true,
  minify: true,
  charset: 'utf8',
  format: 'esm',
}).catch(e => console.error(e));
