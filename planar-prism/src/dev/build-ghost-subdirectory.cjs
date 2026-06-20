const { readdirSync } = require('fs');
const { build } = require('esbuild');
const path = require('path');

const target = process.argv[2];
if (!target) throw new Error(`Wrong arguments. Usage: node script.js target, where target is a ghost subdirectory to build`)

const srcDir = path.join(__dirname, '..', '..', '..', 'planar-ghost', 'ghost', target);
const files = readdirSync(srcDir).filter(f => f.endsWith('.ts')).map(f => path.join(srcDir, f));

build({
  entryPoints: files,
  outdir: path.join(srcDir, 'dist'),
  alias: { '@planar/shared': path.join(__dirname, '..', '..', '..', 'node_modules', '@planar/shared') },
  platform: 'node',
  target: 'node16',
  bundle: true,
  minify: true,
  charset: 'utf8',
  format: 'iife',
  globalName: 'ghost',
  banner: { js: '"use strict";' },
  footer: { js: 'ghost.default' },
}).catch(e => console.error(e));
