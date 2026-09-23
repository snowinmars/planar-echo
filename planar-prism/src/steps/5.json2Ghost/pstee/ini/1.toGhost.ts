import {
  GHOST_INI_ANIMATION_SLOT_KEYS,
  GHOST_INI_FIVE_CYCLE_SLOTS,
  isHex4Ini,
  isNothing,
  isResdataIni,
  maybeMap,
  nothing,
  optional,
} from '@planar/shared';

import type {
  FacingCycle,
  GhostIniAnimation,
  GhostIniAnimationSlot,
  GhostIniAnimationSlotKey,
  GhostIniArea,
  GhostIniMonsterPlanescapeSection,
  GhostIniNumberedSection,
  GhostIniResdata,
  GhostIniSoundsSection,
  Maybe,
} from '@planar/shared';

import type { RawIni } from '@/steps/4.biffs2json/pstee/ini/parseInis.types.js';

export type GhostIniFile = GhostIniResdata | GhostIniAnimation | GhostIniArea;

const extendWithExtension = (x: string, e: string): string => `${x}.${e}`;
const extendWithBamExtension = (x: string): string => extendWithExtension(x, 'bam');
const extendWithWavExtension = (x: string): string => extendWithExtension(x, 'wav');

const soundsOf = (raw: RawIni): Maybe<GhostIniSoundsSection> => (raw.sounds
  ? {
      ...raw.sounds,
      dfbSounds: optional(maybeMap(raw.sounds.dfbSound, x => x.split(',').map(extendWithWavExtension)), []),
      at1Sounds: optional(maybeMap(raw.sounds.at1Sound, x => x.split(',').map(extendWithWavExtension)), []),
      at2Sounds: optional(maybeMap(raw.sounds.at2Sound, x => x.split(',').map(extendWithWavExtension)), []),
      cf1Sounds: optional(maybeMap(raw.sounds.cf1Sound, x => x.split(',').map(extendWithWavExtension)), []),
      hitSounds: optional(maybeMap(raw.sounds.hitSound, x => x.split(',').map(extendWithWavExtension)), []),
    }
  : nothing());

const numberedOf = (raw: RawIni): GhostIniNumberedSection[] => raw.numberedSections.map(x => ({
  ...x,
  dfbSounds: optional(maybeMap(x.dfbSound, x => x.split(',').map(extendWithWavExtension)), []),
  at1Sounds: optional(maybeMap(x.at1Sound, x => x.split(',').map(extendWithWavExtension)), []),
  at2Sounds: optional(maybeMap(x.at2Sound, x => x.split(',').map(extendWithWavExtension)), []),
  cf1Sounds: optional(maybeMap(x.cf1Sound, x => x.split(',').map(extendWithWavExtension)), []),
  hitSounds: optional(maybeMap(x.hitSound, x => x.split(',').map(extendWithWavExtension)), []),
}));

const creatureSectionsOf = (raw: RawIni): GhostIniArea['creatureSections'] => raw.creatureSections.map(x => ({
  ...x,
  spawnPoint: optional(x.spawnPoint, []),
  ai: {
    ea: x.aiEa,
    faction: x.aiFaction,
    team: x.aiTeam,
    general: x.aiGeneral,
    race: x.aiRace,
    class: x.aiClass,
    specifics: x.aiSpecifics,
    gender: x.aiGender,
    alignment: x.aiAlignment,
  },
}));

const slotOf = (bam: Maybe<string>, facingCycle: FacingCycle): Maybe<GhostIniAnimationSlot> => {
  if (typeof bam !== 'string' || bam === '') return nothing();

  return {
    bam: extendWithBamExtension(bam),
    facingCycle,
  };
};

const monsterPlanescapeOf = (raw: RawIni): GhostIniMonsterPlanescapeSection => {
  const monster = raw.monsterPlanescape;
  if (isNothing(monster)) throw new Error(`Ini '${raw.resourceName}' cannot be converted to animation because it has no 'monster' section`);

  const slots: {
    [K in GhostIniAnimationSlotKey]?: GhostIniAnimationSlot;
  } & {
    runscale?: Maybe<number>;
    bestiary?: Maybe<number>;
    armor?: Maybe<number>;
  } = {
    runscale: monster.runscale,
    bestiary: monster.bestiary,
    armor: monster.armor,
  };

  for (const key of GHOST_INI_ANIMATION_SLOT_KEYS) {
    const facingCycle: FacingCycle = GHOST_INI_FIVE_CYCLE_SLOTS.has(key) ? 'five' : 'nine';

    const slot = slotOf(monster[key], facingCycle);
    if (!isNothing(slot)) slots[key] = slot;
  }

  const walk = slots.walk;
  if (isNothing(slots.run) && !isNothing(walk)) slots.run = walk;

  return slots;
};

const toResdata = (raw: RawIni): GhostIniResdata => ({
  resourceName: raw.resourceName,
  numberedSections: numberedOf(raw),
});

const toAnimation = (raw: RawIni): GhostIniAnimation => {
  const general = raw.general;
  if (isNothing(general)) {
    throw new Error(`Ini '${raw.resourceName}' cannot be converted to animation because it has no 'general' section`);
  }

  return {
    resourceName: raw.resourceName,
    general,
    monsterPlanescape: monsterPlanescapeOf(raw),
    sounds: soundsOf(raw),
  };
};

const toArea = (raw: RawIni): GhostIniArea => ({
  resourceName: raw.resourceName,
  nameless: raw.nameless,
  namelessvar: raw.namelessvar,
  locals: raw.locals,
  spawnMain: raw.spawnMain,
  groupSections: raw.groupSections,
  creatureSections: creatureSectionsOf(raw),
});

export const toGhost = (raw: RawIni): GhostIniFile => {
  if (isResdataIni(raw.resourceName)) return toResdata(raw);
  if (isHex4Ini(raw.resourceName)) return toAnimation(raw);
  return toArea(raw);
};
