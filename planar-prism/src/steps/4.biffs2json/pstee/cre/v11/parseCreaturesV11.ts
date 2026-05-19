import { just, nothing } from '@planar/shared';
import { parseHeaderV11 } from './parsers/index.js';
import { parseKnownSpellsV11 } from './parsers/index.js';
import { parseSpellMemorizationInfosV11 } from './parsers/index.js';
import { parseMemorizedSpellsTableV11 } from './parsers/index.js';
import { parseEffectsV10 } from './parsers/index.js';
import { parseEffectsV20 } from './parsers/index.js';
import { parseCreatureItemsV11 } from './parsers/index.js';
import { parseItemSlotsV11 } from './parsers/index.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { CreatureV11 } from '../types.js';
import type { Ids } from '../../ids/index.js';

type ParseCreaturesV11Props = Readonly<{
  reader: BufferReader;
  ids: Map<string, Ids>;
  resourceName: string;
}>;
export const parseCreaturesV11 = ({
  reader,
  ids,
  resourceName,
}: ParseCreaturesV11Props): CreatureV11 => {
  const header = parseHeaderV11({
    reader,
    ids,
  });

  const knownSpells = parseKnownSpellsV11({
    reader: reader.fork(header.knownSpellsOffset),
    count: header.knownSpellsCount,
  });

  const spellMemorizationInfos = parseSpellMemorizationInfosV11({
    reader: reader.fork(header.spellMemorizationInfoOffset),
    count: header.spellMemorizationInfoEntriesCount,
  });

  const memorizedSpellsTable = parseMemorizedSpellsTableV11({
    reader: reader.fork(header.memorizedSpellsOffset),
    count: header.memorizedSpellsCount,
  });

  const effectsV11 = header.effectVersion === 0
    ? parseEffectsV10({
        reader: reader.fork(header.offsetToEffects),
        count: header.countOfEffects,
      })
    : nothing();

  const effectsV20 = header.effectVersion === 1
    ? parseEffectsV20({
        reader: reader.fork(header.offsetToEffects),
        count: header.countOfEffects,
      })
    : nothing();

  const itemsTable = parseCreatureItemsV11({
    reader: reader.fork(header.offsetToItems),
    count: header.countOfItems,
  });

  const itemSlots = parseItemSlotsV11(reader.fork(header.offsetToItemSlots));

  const effects = effectsV11 ? just(effectsV11) : just(effectsV20); // i guarantee it during parseHeaderV11

  return {
    resourceName: resourceName,
    header,
    knownSpells,
    spellMemorizationInfos,
    memorizedSpellsTable,
    effects,
    itemsTable,
    itemSlots,
  };
};
