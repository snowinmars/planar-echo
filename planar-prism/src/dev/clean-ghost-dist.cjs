const { readdirSync, rmSync, existsSync } = require('fs');
const path = require('path');

const ghostRoot = path.join(__dirname, '..', '..', '..', 'planar-ghost', 'ghost');
if (!existsSync(ghostRoot)) return;

for (const entry of readdirSync(ghostRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const distPath = path.join(ghostRoot, entry.name, 'dist');
  if (!existsSync(distPath)) continue;
  rmSync(distPath, { recursive: true, force: true });
}
