import { just, nothing } from '@planar/shared';
import {
  parseHeaderV10,
  parseKnownSpellsV10,
  parseSpellMemorizationInfosV10,
  parseMemorizedSpellsTableV10,
  parseEffectsV10,
  parseEffectsV20,
  parseCreItemsV10,
  parseItemSlotsV10,
} from './parsers/index.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawCreV10 } from '../parseCres.types.js';
import type { RawIds } from '../../ids/index.js';

type ParseCreV10Props = Readonly<{
  reader: BufferReader;
  ids: Map<string, RawIds>;
  resourceName: string;
}>;
export const parseCreV10 = ({
  reader,
  ids,
  resourceName,
}: ParseCreV10Props): RawCreV10 => {
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

  const itemsTable = parseCreItemsV10({
    reader: reader.fork(header.offsetToItems),
    count: header.countOfItems,
  });

  const itemSlots = parseItemSlotsV10(reader.fork(header.offsetToItemSlots));

  const effects = effectsV10 ? just(effectsV10) : just(effectsV20); // i guarantee it during parseHeaderV10

  return {
    resourceName,
    header,
    knownSpells,
    spellMemorizationInfos,
    memorizedSpellsTable,
    effects,
    itemsTable,
    itemSlots,
  };
};
