import { nothing } from '@planar/shared';
import { parseIniFromString } from '../iniParser/iniParser.js';
import parseNamelessSectionV1 from './parsers/parseNamelessSectionV1.js';
import parseNamelessvarSectionV1 from './parsers/parseNamelessvarSectionV1.js';
import parseLocalsSectionV1 from './parsers/parseLocalsSectionV1.js';
import parseSpawnMainSectionV1 from './parsers/parseSpawnMainSectionV1.js';
import parseGeneralSectionV1 from './parsers/parseGeneralSectionV1.js';
import parseGroupSectionV1 from './parsers/parseGroupSectionV1.js';
import parseCreatureSectionV1 from './parsers/parseCreatureSectionV1.js';
import parseMonsterPlanescapeSectionV1 from './parsers/parseMonsterPlanescapeIniSectionV1.js';
import parseSoundsSectionV1 from './parsers/parseSoundsSectionV1.js';
import parseNumberedSectionV1 from './parsers/parseNumberedSectionV1.js';

import type { Maybe } from '@planar/shared';
import type { Ini, Signature, Versions } from '../types.js';
import type { Meta } from '../../types.js';

const patchIniSyntax = (content: string, resourceName: string): string => {
  switch (resourceName) {
    case 'ar0203.ini': return content.replace('[repetitive', '[repetitive]');
    case 'ar1600.ini': return content.replaceAll('[3898,1705:8]', '[3898.1705:8]');
    default: return content;
  }
};

const numberRegex = /^\d+$/;

const parseIniV1FromBuffer = (buffer: Buffer, meta: Meta<Signature, Versions>): Ini => {
  const content = patchIniSyntax(buffer.toString(), meta.resourceName);
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
        monsterPlanescape = parseMonsterPlanescapeSectionV1(section);
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
      const creature = parseCreatureSectionV1(section, meta);
      if (creature) creatureSections.push(creature);
      continue;
    }

    throw new Error(`Cannot parse section ${section.name} at file ${meta.resourceName}`);
  }

  return {
    resourceName: meta.resourceName,
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

export default parseIniV1FromBuffer;
