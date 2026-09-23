import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { buildOpenApiDocument } from '../controllers/router.js';

const dir = dirname(fileURLToPath(import.meta.url));
const out = join(dir, '../swagger/swagger.json');
writeFileSync(out, `${JSON.stringify(buildOpenApiDocument())}\n`);
console.log(`Wrote ${out}`);
