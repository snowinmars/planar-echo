import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const initialGhostDir = resolve(join(__dirname, '..', '..', '..', '..', 'planar-ghost'));
const initialPrismDir = resolve(join(__dirname, '..', '..', '..', '..', 'planar-prism', 'dist'));
const initialShellDir = resolve(join(__dirname, '..', '..', '..', '..', 'planar-shell', 'dist'));
let ghostDir = initialGhostDir;
let prismDir = initialPrismDir;
let shellDir = initialShellDir;

export const getGhostDir = () => ghostDir;
export const setGhostDir = (x: string): string => {
  ghostDir = x;
  return ghostDir;
};
export const getPrismDir = () => prismDir;
export const setPrismDir = (x: string): string => {
  prismDir = x;
  return prismDir;
};
export const getShellDir = () => shellDir;
export const setShellDir = (x: string): string => {
  shellDir = x;
  return shellDir;
};
