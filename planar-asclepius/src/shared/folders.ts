import { fileExists } from '@planar/shared/node';
import { normalize, join, dirname } from 'path';
import { fileURLToPath } from 'url';

type ValidateIndexPathesProps = Readonly<{
  ghostDir: string;
  shellDir: string;
  prismDir: string;
}>;
const validateIndexPathes = async ({
  ghostDir,
  shellDir,
  prismDir,
}: ValidateIndexPathesProps) => {
  const ghostDirExists = await fileExists(ghostDir);
  const shellDirExists = await fileExists(shellDir);
  const prismDirExists = await fileExists(prismDir);

  if (ghostDirExists) console.log(`  Use planar-ghost directory at '${ghostDir}'`);
  else console.warn(`planar-ghost was not found at '${ghostDir}'`);

  if (shellDirExists) console.log(`  Use planar-shell directory at '${shellDir}'`);
  else console.warn(`planar-shell was not found at '${shellDir}'`);

  if (prismDirExists) console.log(`  Use planar-prism directory at '${prismDir}'`);
  else console.warn(`planar-prism was not found at '${prismDir}'`);

  if (!ghostDirExists || !shellDirExists || !prismDirExists) process.exit(17);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ghostDir = normalize(join(__dirname, '../../../planar-ghost'));
const shellDir = normalize(join(__dirname, '../../../planar-shell'));
const prismDir = normalize(join(__dirname, '../../../planar-prism'));

validateIndexPathes({
  ghostDir,
  shellDir,
  prismDir,
}).catch(e => console.error(e));

export {
  ghostDir,
  shellDir,
  prismDir,
};
