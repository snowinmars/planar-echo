import { nothing } from '@planar/shared';
import { parseIniFromString } from '../iniParser/iniParser.js';
import {
  parseNamelessSectionV1,
  parseNamelessvarSectionV1,
  parseLocalsSectionV1,
  parseSpawnMainSectionV1,
  parseGeneralSectionV1,
  parseGroupSectionV1,
  parseCreatureSectionV1,
  parseMonsterPlanescapeIniSectionV1,
  parseSoundsSectionV1,
  parseNumberedSectionV1,
} from './parsers/index.js';

import type { Maybe } from '@planar/shared';
import type { Ini } from '../types.js';

const patchIniSyntax = (content: string, resourceName: string): string => {
  switch (resourceName) {
    case 'ar0203.ini': return content.replace('[repetitive', '[repetitive]');
    case 'ar1600.ini': return content.replaceAll('[3898,1705:8]', '[3898.1705:8]');
    default: return content;
  }
};

const numberRegex = /^\d+$/;

type ParseIniV1Props = Readonly<{
  buffer: Buffer;
  resourceName: string;
}>;
export const parseIniV1 = ({
  buffer,
  resourceName,
}: ParseIniV1Props): Ini => {
  const content = patchIniSyntax(buffer.toString(), resourceName);
  const ini = parseIniFromString(content);

  let nameless: Maybe<Ini['nameless']> = nothing();
  let namelessvar: Maybe<Ini['namelessvar']> = nothing();
  let locals: Maybe<Ini['locals']> = nothing();
  let spawnMain: Maybe<Ini['spawnMain']> = nothing();
  let general: Maybe<Ini['general']> = nothing();
  let monsterPlanescape: Maybe<Ini['monsterPlanescape']> = nothing();
  let sounds: Maybe<Ini['sounds']> = nothing();
  const numberedSections: Ini['numberedSections'] = [];
  const groupSections: Ini['groupSections'] = [];
  const creatureSections: Ini['creatureSections'] = [];

  for (const section of ini.sections) {
    if (!section.entries.length) continue;

    switch (section.name) {
      case 'nameless': {
        nameless = parseNamelessSectionV1(section);
        continue;
      }
      case 'namelessvar': {
        namelessvar = parseNamelessvarSectionV1(section);
        continue;
      }
      case 'locals': {
        locals = parseLocalsSectionV1(section);
        continue;
      }
      case 'spawn_main': {
        spawnMain = parseSpawnMainSectionV1(section);
        continue;
      }
      case 'general': {
        general = parseGeneralSectionV1(section);
        continue;
      }
      case 'monster_planescape': {
        monsterPlanescape = parseMonsterPlanescapeIniSectionV1(section);
        continue;
      }
      case 'sounds': {
        sounds = parseSoundsSectionV1(section);
        continue;
      }
      default: break;
    }

    const isNumberedSection = numberRegex.test(section.name);
    if (isNumberedSection) {
      const numberedSection = parseNumberedSectionV1(section);
      if (numberedSection) numberedSections.push(numberedSection);
      continue;
    }

    const entryKeys = new Set(section.entries.map(e => e.key));

    const isGroupSection = entryKeys.has('critters');
    if (isGroupSection) {
      const group = parseGroupSectionV1(section);
      if (group) groupSections.push(group);
      continue;
    }

    const isCreatureSection = entryKeys.has('spec');
    if (isCreatureSection) {
      const creature = parseCreatureSectionV1(section);
      if (creature) creatureSections.push(creature);
      continue;
    }

    throw new Error(`Cannot parse section ${section.name} at file ${resourceName}`);
  }

  return {
    resourceName,
    nameless,
    namelessvar,
    locals,
    spawnMain,
    general,
    monsterPlanescape,
    sounds,
    numberedSections,
    groupSections,
    creatureSections,
  };
};
