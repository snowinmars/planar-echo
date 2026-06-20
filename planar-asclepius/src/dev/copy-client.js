import fs from 'fs/promises';
import { dirname, join } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const copyClient = async () => {
  const src = join(__dirname, '../swagger');
  const shellRoot = dirname(require.resolve('@planar/shell/package.json'));
  const dest = join(shellRoot, 'src/swagger');

  await fs.rm(dest, { recursive: true, force: true });
  await fs.cp(src, dest, { recursive: true });
  console.log('Client copied to shell');
};

copyClient().catch(console.error);
