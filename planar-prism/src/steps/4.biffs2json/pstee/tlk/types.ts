import type { Header } from './v1/parsers/1.parseHeaderV1.types.js';
import type { TlkItem } from './v1/parsers/2.parseItemsV1.types.js';

export type Tlk = Readonly<{
  header: Header;
  itemsMap: Map<number, TlkItem>;
  get: (id: number) => TlkItem;
  getText: (id: number) => string;
}>;
