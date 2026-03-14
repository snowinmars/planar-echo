import type { Header } from './v1.types/1.header.js';
import type { Item } from './v1.types/2.item.js';

export type Tlk = Readonly<{
  header: Header;
  itemsMap: Map<number, Item>;
  get: (id: number) => Item;
  getText: (id: number) => string;
}>;
