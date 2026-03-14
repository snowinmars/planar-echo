import { just, nothing } from '../../../../shared/maybe.js';
import parseHeaderV10 from './parsers/1.parseHeaderV10.js';
import parseKnownSpellsV10 from './parsers/2.parseKnownSpellsV10.js';
import parseSpellMemorizationInfosV10 from './parsers/3.parseSpellMemorizationInfosV10.js';
import parseMemorizedSpellsTableV10 from './parsers/4.parseMemorizedSpellsTableV10.js';
import parseEffectsV10 from './parsers/5.parseEffectsV10.js';
import parseEffectsV20 from './parsers/5.parseEffectsV20.js';
import parseCreatureItemsV10 from './parsers/6.parseCreatureItemsV10.js';
import parseItemSlotsV10 from './parsers/7.parseItemSlotsV10.js';

import type { CreatureV10, Signature, Versions } from '../types.js';
import type { Maybe } from '../../../../shared/maybe.js';
import type { BufferReader } from '../../../../pipes/readers.js';
import type { EffectV10 } from '../v10.types/5.effectV10.js';
import type { EffectV20 } from '../v10.types/5.effectV20.js';
import type { Meta } from '../../types.js';

const parseCreaturesV10FromBuffer = (reader: BufferReader, meta: Meta<Signature, Versions>): CreatureV10 => {
  const header = parseHeaderV10(reader, meta);

  const knownSpells = parseKnownSpellsV10(reader.fork(header.knownSpellsOffset), header.knownSpellsCount, meta);
  const spellMemorizationInfos = parseSpellMemorizationInfosV10(reader.fork(header.memorizedSpellsOffset), header.memorizedSpellsCount, meta);
  const memorizedSpellsTable = parseMemorizedSpellsTableV10(reader.fork(header.memorizedSpellsOffset), header.memorizedSpellsCount, meta);
  const effectsV10: Maybe<EffectV10[]> = header.effStructureVersion === 0 ? parseEffectsV10(reader.fork(header.offsetToEffects), header.countOfEffects, meta) : nothing();
  const effectsV20: Maybe<EffectV20[]> = header.effStructureVersion === 1 ? parseEffectsV20(reader.fork(header.offsetToEffects), header.countOfEffects, meta) : nothing();
  const itemsTable = parseCreatureItemsV10(reader.fork(header.offsetToItems), header.countOfItems, meta);
  const itemSlots = parseItemSlotsV10(reader.fork(header.offsetToItemSlots), meta);

  const effects = effectsV10 ? just(effectsV10) : just(effectsV20); // i guarantee it during parseHeaderV10

  return {
    resourceName: meta.resourceName,
    header,
    knownSpells,
    spellMemorizationInfos,
    memorizedSpellsTable,
    effects,
    itemsTable,
    itemSlots,
  };
};

export default parseCreaturesV10FromBuffer;
