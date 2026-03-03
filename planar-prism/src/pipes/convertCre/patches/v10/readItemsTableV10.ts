import type { BufferReader } from '../../../../pipes/readers.js';
import type { CreatureMeta } from '../readCreatureBufferTypes.js';
import { offsetMap, type CreatureItemV10 } from './readItemsTableTypesV10.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import type { CreatureHeaderV10 } from './readHeaderTypesV10.js';

const readCreatureItemV10 = (reader: BufferReader, meta: CreatureMeta): CreatureItemV10 => {
  const tmp: PartialWriteable<CreatureItemV10> = {};

  tmp.resourceName = reader.string(8);
  tmp.time1 = reader.byte();
  tmp.time2 = reader.byte();
  tmp.quantityCharges1 = reader.short();
  tmp.quantityCharges2 = reader.short();
  tmp.quantityCharges3 = reader.short();
  tmp.flags = reader.map.uint(offsetMap.flags.parseFlags);

  return {
    resourceName: tmp.resourceName,
    time1: tmp.time1,
    time2: tmp.time2,
    quantityCharges1: tmp.quantityCharges1,
    quantityCharges2: tmp.quantityCharges2,
    quantityCharges3: tmp.quantityCharges3,
    flags: tmp.flags,
  };
};

const readCreatureItemsV10 = (reader: BufferReader, header: CreatureHeaderV10, meta: CreatureMeta): CreatureItemV10[] => {
  const creatureItemSize = 12;
  const creatureItems: CreatureItemV10[] = [];
  for (let i = 0; i < header.countOfItems; i++) {
    const offset = header.offsetToItems + i * creatureItemSize;
    const CreatureItem = readCreatureItemV10(reader.fork(offset), meta);
    creatureItems.push(CreatureItem);
  }

  return creatureItems;
};

export default readCreatureItemsV10;
