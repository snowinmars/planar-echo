import { either, nothing } from '@planar/shared';

import type { GhostIni, GhostIniMonsterPlanescapeSection, GhostIniSoundsSection, Maybe } from '@planar/shared';

import type { RawIni } from '@/steps/4.biffs2json/pstee/ini/parseInis.types.js';

const extendWithExtension = (x: Maybe<string>, e: string): Maybe<string> => x ? `${x}.${e}` : nothing();
const extendWithBamExtension = (x: Maybe<string>): Maybe<string> => extendWithExtension(x, 'bam');
const extendWithWavExtension = (x: Maybe<string>): Maybe<string> => extendWithExtension(x, 'wav');

export const toGhost = (raw: RawIni): GhostIni => {
  const numberedSections = raw.numberedSections.map((x) => {
    return {
      ...x,
      hitsound: either(x.hitsound, []),
    };
  });

  const sounds: Maybe<GhostIniSoundsSection> = raw.sounds
    ? {
        ...raw.sounds,
        dfbsound: extendWithWavExtension(raw.sounds.dfbsound),
        at1Sound: extendWithWavExtension(raw.sounds.at1Sound),
        at2Sound: extendWithWavExtension(raw.sounds.at2Sound),
        cf1Sound: extendWithWavExtension(raw.sounds.cf1Sound),
        hitsound: either(raw.sounds.hitsound, []).map(extendWithWavExtension) as string[], // TODO [snow]: it is ok to force type, but...
      }
    : nothing();

  const creatureSections = raw.creatureSections.map((x) => {
    return {
      ...x,
      spawnPoint: either(x.spawnPoint, []),
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
    };
  });

  const monsterPlanescape: Maybe<GhostIniMonsterPlanescapeSection> = raw.monsterPlanescape
    ? {
        attack1: extendWithBamExtension(raw.monsterPlanescape.attack1),
        attack2: extendWithBamExtension(raw.monsterPlanescape.attack2),
        stance2stand: extendWithBamExtension(raw.monsterPlanescape.stance2stand),
        stancefidget1: extendWithBamExtension(raw.monsterPlanescape.stancefidget1),
        diebackward: extendWithBamExtension(raw.monsterPlanescape.diebackward),
        getup: extendWithBamExtension(raw.monsterPlanescape.getup),
        gethit: extendWithBamExtension(raw.monsterPlanescape.gethit),
        run: extendWithBamExtension(raw.monsterPlanescape.run),
        stand2stance: extendWithBamExtension(raw.monsterPlanescape.stand2stance),
        standfidget1: extendWithBamExtension(raw.monsterPlanescape.standfidget1),
        spell1: extendWithBamExtension(raw.monsterPlanescape.spell1),
        spell2: extendWithBamExtension(raw.monsterPlanescape.spell2),
        stance: extendWithBamExtension(raw.monsterPlanescape.stance),
        stand: extendWithBamExtension(raw.monsterPlanescape.stand),
        talk1: extendWithBamExtension(raw.monsterPlanescape.talk1),
        walk: extendWithBamExtension(raw.monsterPlanescape.walk),
        runscale: raw.monsterPlanescape.runscale,
        bestiary: raw.monsterPlanescape.bestiary,
        armor: raw.monsterPlanescape.armor,
      }
    : nothing();

  return {
    ...raw,
    numberedSections,
    sounds,
    creatureSections,
    monsterPlanescape,
  };
};
