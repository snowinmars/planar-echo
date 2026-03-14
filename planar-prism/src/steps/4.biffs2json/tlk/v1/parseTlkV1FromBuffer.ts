import type { BufferReader } from '../../../../pipes/readers.js';
import type { Tlk } from '../types.js';
import parseHeaderV1 from './parsers/1.parseHeaderV1.js';
import parseItemsV1 from './parsers/2.parseItemsV1.js';
import type { Item } from '../v1.types/2.item.js';

const get = (itemsMap: Map<number, Item>, id: number): Item => {
  const longNameTlkItem = itemsMap.get(id);
  if (!longNameTlkItem) throw new Error(`Unable to find tlk translation '${id}'`);
  return longNameTlkItem;
};
const getText = (itemsMap: Map<number, Item>, id: number): string => {
  return get(itemsMap, id).text;
};

const parseTlkV1FromBuffer = (reader: BufferReader, signature: 'tlk', version: 'v1'): Tlk => {
  const header = parseHeaderV1(reader, signature, version);
  const itemsMap = parseItemsV1(reader, header);

  return {
    header,
    itemsMap,
    get: x => get(itemsMap, x),
    getText: x => getText(itemsMap, x),
  };
};

export default parseTlkV1FromBuffer;
