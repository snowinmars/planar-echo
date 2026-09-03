import { just, nothing } from '@planar/shared';

import {
  parseCreItemsV11,
  parseEffectsV10,
  parseEffectsV20,
  parseHeaderV11,
  parseItemSlotsV11,
  parseKnownSpellsV11,
  parseMemorizedSpellsTableV11,
  parseSpellMemorizationInfosV11,
} from './parsers/index.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawIds } from '../../ids/index.js';
import type { RawCreV11 } from '../parseCres.types.js';

type ParseCreV11Props = Readonly<{
  reader: BufferReader;
  ids: Map<string, RawIds>;
  resourceName: string;
}>;
export const parseCreV11 = ({
  reader,
  ids,
  resourceName,
}: ParseCreV11Props): RawCreV11 => {
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

  const itemsTable = parseCreItemsV11({
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
