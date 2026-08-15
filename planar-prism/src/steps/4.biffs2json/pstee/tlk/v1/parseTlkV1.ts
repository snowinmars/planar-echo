import { headerLengthBytes } from './parsers/1.parseHeaderV1.types.js';
import {
  parseHeaderV1,
  parseItemsV1,
} from './parsers/index.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawTlk } from '../types.js';
import type { RawTlkItem } from './parsers/2.parseItemsV1.types.js';

const get = (itemsMap: Map<number, RawTlkItem>, id: number): RawTlkItem => {
  const longNameTlkItem = itemsMap.get(id);
  if (!longNameTlkItem) throw new Error(`Unable to find tlk translation '${id}'`);
  return longNameTlkItem;
};

const getText = (itemsMap: Map<number, RawTlkItem>, id: number): string => get(itemsMap, id).text;

type ParseTlkV1Props = Readonly<{
  reader: BufferReader;
  signature: 'tlk';
  version: 'v1';
}>;
export const parseTlkV1 = ({
  reader,
  signature,
  version,
}: ParseTlkV1Props): RawTlk => {
  const header = parseHeaderV1({
    reader,
    signature,
    version,
  });
  const itemsMap = parseItemsV1({
    reader,
    headerLengthBytes: headerLengthBytes,
    stringCount: header.stringCount,
    stringOffset: header.stringOffset,
  });

  return {
    header,
    itemsMap,
    get: x => get(itemsMap, x),
    getText: x => getText(itemsMap, x),
  };
};
