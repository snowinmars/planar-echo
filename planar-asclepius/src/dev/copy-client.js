import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyClient = async () => {
  const src = path.join(__dirname, '../swagger');
  const dest = path.join(__dirname, '../../../planar-shell/src/swagger');

  await fs.rm(dest, { recursive: true, force: true });
  await fs.cp(src, dest, { recursive: true });
  console.log('Client copied to shell');
};

copyClient().catch(console.error);
