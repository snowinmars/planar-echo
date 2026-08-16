const { readdirSync } = require('fs');
const { build } = require('esbuild');
const path = require('path');
const { typecheckGhostFiles } = require('./typecheck-ghost-files.cjs');

const srcDir = path.join(__dirname, '..', '..', '..', 'planar-ghost', 'ghost', 'stores');
const files = readdirSync(srcDir).filter(f => f.endsWith('.ts')).map(f => path.join(srcDir, f));
if (files.length === 0) return;

const { goodFiles, errorCount } = typecheckGhostFiles(files);

const emit = goodFiles.length === 0
  ? Promise.resolve()
  : build({
    entryPoints: goodFiles,
    outdir: path.join(srcDir, 'dist'),
    alias: { '@planar/shared': path.join(__dirname, '..', '..', '..', 'node_modules', '@planar/shared') },
    platform: 'browser',
    target: 'es2020',
    bundle: true,
    minify: true,
    charset: 'utf8',
    format: 'esm',
  });

emit
  .then(() => {
    if (errorCount > 0) process.exit(1);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
