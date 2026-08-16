const { readdirSync } = require('fs');
const { build } = require('esbuild');
const path = require('path');
const { typecheckGhostFiles } = require('./typecheck-ghost-files.cjs');

const target = process.argv[2];
if (!target) throw new Error(`Wrong arguments. Usage: node script.js target, where target is a ghost subdirectory to build`)

const srcDir = path.join(__dirname, '..', '..', '..', 'planar-ghost', 'ghost', target);
const files = readdirSync(srcDir).filter(f => f.endsWith('.ts')).map(f => path.join(srcDir, f));
if (files.length === 0) return;

const { goodFiles, errorCount } = typecheckGhostFiles(files);

const emit = goodFiles.length === 0
  ? Promise.resolve()
  : build({
    entryPoints: goodFiles,
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
  });

emit
  .then(() => {
    if (errorCount > 0) process.exit(1);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
