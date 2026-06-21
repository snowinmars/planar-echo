import fs from 'fs/promises';
import { dirname, join } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clean = async () => {
  const distPath = join(__dirname, '..', '..', 'dist');
  await fs.rm(distPath, { recursive: true });
};

clean().catch(console.error);
