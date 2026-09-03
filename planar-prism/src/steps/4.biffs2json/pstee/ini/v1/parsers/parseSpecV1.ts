import { resolveIniIds } from './resolveIniIds.js';

import type { Maybe } from '@planar/shared';

import type { RawIds } from '../../../ids/index.js';
import type { RawIniCreatureIniSpec } from './parseSpecV1.types.js';

export const parseSpecV1 = (s: Maybe<string>, ids: Map<string, RawIds>): string | RawIniCreatureIniSpec => {
  if (!s) throw new Error(`Cannot parse Spec variable from nothing`);

  const seemsScriptName = !s.startsWith('[') && !s.endsWith(']');
  if (seemsScriptName) return s;

  // [EA.FACTION.TEAM.GENERAL.RACE.CLASS.SPECIFIC.GENDER.ALIGN]
  const items = s.slice(1, -1).split('.');

  /* eslint-disable @stylistic/no-multi-spaces */
  const ea        = resolveIniIds(items[0] ?? '0', ids.get('ea.ids')!.entries);
  const faction   = resolveIniIds(items[1] ?? '0', ids.get('faction.ids')!.entries);
  const team      = resolveIniIds(items[2] ?? '0', ids.get('team.ids')!.entries);
  const general   = resolveIniIds(items[3] ?? '0', ids.get('general.ids')!.entries);
  const race      = resolveIniIds(items[4] ?? '0', ids.get('race.ids')!.entries);
  const theClass  = resolveIniIds(items[5] ?? '0', ids.get('class.ids')!.entries);
  const specifics = resolveIniIds(items[6] ?? '0', ids.get('specific.ids')!.entries);
  const gender    = resolveIniIds(items[7] ?? '0', ids.get('gender.ids')!.entries);
  const alignment = resolveIniIds(items[8] ?? '0', ids.get('align.ids')!.entries);
  /* eslint-enable */

  return {
    ea,
    faction,
    team,
    general,
    race,
    class: theClass,
    specifics,
    gender,
    alignment,
  };
};
