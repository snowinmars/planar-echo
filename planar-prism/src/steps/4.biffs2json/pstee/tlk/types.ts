import type { RawTlkHeader } from './v1/parsers/1.parseHeaderV1.types.js';
import type { RawTlkItem } from './v1/parsers/2.parseItemsV1.types.js';

export type RawTlk = Readonly<{
  resourceName: string;
  header: RawTlkHeader;
  itemsMap: Map<number, RawTlkItem>;
  get: (id: number) => RawTlkItem;
  getText: (id: number) => string;
}>;
