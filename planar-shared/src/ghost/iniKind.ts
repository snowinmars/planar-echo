export const GHOST_INI_ANIMATION_SLOT_KEYS = [
  'attack1',
  'attack2',
  'diebackward',
  'gethit',
  'getup',
  'run',
  'spell1',
  'spell2',
  'stance',
  'stance2stand',
  'stancefidget1',
  'stand',
  'stand2stance',
  'standfidget1',
  'talk1',
  'walk',
] as const;
export type GhostIniAnimationSlotKey = typeof GHOST_INI_ANIMATION_SLOT_KEYS[number];

export const GHOST_INI_FIVE_CYCLE_SLOTS: ReadonlySet<GhostIniAnimationSlotKey> = new Set([
  'stance',
  'stance2stand',
  'stancefidget1',
  'stand',
  'stand2stance',
  'standfidget1',
]);
export const isResdataIni = (resourceName: string): boolean => resourceName === 'resdata.ini';
export const isHex4Ini = (resourceName: string): boolean => /^[0-9a-f]{4}\.ini$/iu.test(resourceName);
