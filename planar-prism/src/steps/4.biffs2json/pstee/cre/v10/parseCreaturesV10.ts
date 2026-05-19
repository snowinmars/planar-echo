import { just, nothing } from '@planar/shared';
import { parseHeaderV10 } from './parsers/index.js';
import { parseKnownSpellsV10 } from './parsers/index.js';
import { parseSpellMemorizationInfosV10 } from './parsers/index.js';
import { parseMemorizedSpellsTableV10 } from './parsers/index.js';
import { parseEffectsV10 } from './parsers/index.js';
import { parseEffectsV20 } from './parsers/index.js';
import { parseCreatureItemsV10 } from './parsers/index.js';
import { parseItemSlotsV10 } from './parsers/index.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { CreatureV10 } from '../types.js';
import type { Ids } from '../../ids/index.js';

type ParseCreaturesV10Props = Readonly<{
  reader: BufferReader;
  ids: Map<string, Ids>;
  resourceName: string;
}>;
export const parseCreaturesV10 = ({
  reader,
  ids,
  resourceName,
}: ParseCreaturesV10Props): CreatureV10 => {
  const header = parseHeaderV10({
    reader,
    ids,
  });

  const knownSpells = parseKnownSpellsV10({
    reader: reader.fork(header.knownSpellsOffset),
    count: header.knownSpellsCount,
  });

  const spellMemorizationInfos = parseSpellMemorizationInfosV10({
    reader: reader.fork(header.spellMemorizationInfoOffset),
    count: header.spellMemorizationInfoEntriesCount,
  });

  const memorizedSpellsTable = parseMemorizedSpellsTableV10({
    reader: reader.fork(header.memorizedSpellsOffset),
    count: header.memorizedSpellsCount,
  });

  const effectsV10 = header.effectVersion === 0
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

  const itemsTable = parseCreatureItemsV10({
    reader: reader.fork(header.offsetToItems),
    count: header.countOfItems,
  });

  const itemSlots = parseItemSlotsV10(reader.fork(header.offsetToItemSlots));

  const effects = effectsV10 ? just(effectsV10) : just(effectsV20); // i guarantee it during parseHeaderV10

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
