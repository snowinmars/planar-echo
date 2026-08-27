import {
  defaultGhostDir,
  defaultPrismDir,
  defaultShellDir,
  defaultWeiduDir,
} from '@/shared/layout.js';

const weiduInstallDir = defaultWeiduDir;
let ghostDir = defaultGhostDir;
let prismDir = defaultPrismDir;
let shellDir = defaultShellDir;

export const getGhostDir = () => ghostDir;
export const getWeiduInstallDir = () => weiduInstallDir;
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
