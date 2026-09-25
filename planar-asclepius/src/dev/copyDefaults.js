import { copyFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, '..', 'asclepius.defaults.json');
const destination = join(here, '..', '..', 'dist', 'asclepius.defaults.json');

if (!existsSync(source)) {
	console.error(`Missing '${source}'`);
	process.exit(1);
}

copyFileSync(source, destination);
