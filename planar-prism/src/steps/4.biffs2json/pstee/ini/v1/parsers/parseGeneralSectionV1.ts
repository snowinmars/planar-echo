import { findEntry } from './shared.js';

import type { Maybe } from '@planar/shared';
import type { Section } from '../../iniParser/iniParserTypes.js';
import type { GeneralIniSection } from './parseGeneralSectionV1.types.js';

export const parseGeneralSectionV1 = (section: Section): Maybe<GeneralIniSection> => {
  if (section.name !== 'general') throw new Error(`Expect section '${section.name}' to be 'general' section`);

  /* eslint-disable @stylistic/no-multi-spaces */
  const animationType = findEntry(section.entries, 'animation_type').stringOrThrow(section.name);
  const moveScale     = findEntry(section.entries, 'move_scale').decOrThrow();
  const ellipse       = findEntry(section.entries, 'ellipse').decOrThrow();
  const colorBlood    = findEntry(section.entries, 'color_blood').decOrThrow();
  const colorChunks   = findEntry(section.entries, 'color_chunks').decOrThrow();
  const soundFreq     = findEntry(section.entries, 'sound_freq').decOrThrow();
  const personalSpace = findEntry(section.entries, 'personal_space').decOrThrow();
  const castFrame     = findEntry(section.entries, 'cast_frame').decOrThrow();
  /* eslint-enable */

  return {
    animationType,
    moveScale,
    ellipse,
    colorBlood,
    colorChunks,
    soundFreq,
    personalSpace,
    castFrame,
  };
};
