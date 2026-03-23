import type { Maybe } from '@planar/shared';
import { parseDecOrThrow } from '@/shared/customParsers.js';
import type { Section, SectionEntry } from '../../iniParser/iniParserTypes.js';
import type { GeneralIniSection } from '../../types.js';

const findEntry = (entries: SectionEntry[], key: string): Maybe<string> => entries.find(e => e.key === key)?.value;

const parseGeneralSectionV1 = (section: Section): Maybe<GeneralIniSection> => {
  if (section.name !== 'general') throw new Error(`Expect section '${section.name}' to be 'general' section`);

  const animationType = findEntry(section.entries, 'animation_type');
  if (!animationType) throw new Error(`AnimationType should not be optional for group ini section ${section.name}`);

  const moveScale = findEntry(section.entries, 'move_scale');
  const ellipse = findEntry(section.entries, 'ellipse');
  const colorBlood = findEntry(section.entries, 'color_blood');
  const colorChunks = findEntry(section.entries, 'color_chunks');
  const soundFreq = findEntry(section.entries, 'sound_freq');
  const personalSpace = findEntry(section.entries, 'personal_space');
  const castFrame = findEntry(section.entries, 'cast_frame');

  return {
    animationType,
    moveScale: parseDecOrThrow(moveScale),
    ellipse: parseDecOrThrow(ellipse),
    colorBlood: parseDecOrThrow(colorBlood),
    colorChunks: parseDecOrThrow(colorChunks),
    soundFreq: parseDecOrThrow(soundFreq),
    personalSpace: parseDecOrThrow(personalSpace),
    castFrame: parseDecOrThrow(castFrame),
  };
};

export default parseGeneralSectionV1;
