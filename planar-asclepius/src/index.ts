import express from 'express';
import { stat } from 'fs/promises';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import { join } from 'path';

import { ghostDir, shellDir } from './shared/folders';
import swaggerSpec from './swagger/swagger.json';
import router from './controllers/router';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3003;

stat(ghostDir)
  .then((s) => {
    //
  }).catch((e) => {
    console.warn(`Предупреждение: каталог ghost не найден по пути ${ghostDir}`);
    console.warn(e);
    process.exit(1);
  });
stat(shellDir)
  .then((s) => {
    //
  }).catch((e) => {
    console.warn(`Предупреждение: каталог ghost не найден по пути ${shellDir}`);
    console.warn(e);
    process.exit(1);
  });

app.get('/api/swagger/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec as JsonObject));

app.use('/static', express.static(join(shellDir, 'dist')));

app.use(router);

app.listen(PORT, () => {
  console.log(`Asclepius is running http://localhost:${PORT}`);
  console.log(`  Swagger at http://localhost:${PORT}/api/swagger/`);
  console.log(`planar-ghost directory: ${ghostDir}`);
  console.log(`planar-shell directory: ${shellDir}`);
});
