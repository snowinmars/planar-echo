import {normalize, join} from 'path';

const ghostDir = normalize(join(__dirname, '../../../planar-ghost'));
const shellDir = normalize(join(__dirname, '../../../planar-shell'));

export {
  ghostDir,
  shellDir,
}
