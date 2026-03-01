import type { ItemExtendedHeaderV10 } from './v10/readExtendedHeaderTypesV10.js';
import type { ItemExtendedHeaderV11 } from './v11/readExtendedHeaderTypesV11.js';
import type { ItemExtendedHeaderV20 } from './v20/readExtendedHeaderTypesV20.js';
import type { ItemFeatureBlockV10 } from './v10/readFeatureBlockTypesV10.js';
import type { ItemFeatureBlockV11 } from './v11/readFeatureBlockTypesV11.js';
import type { ItemFeatureBlockV20 } from './v20/readFeatureBlockTypesV20.js';
import type { ItemHeaderV10 } from './v10/readHeaderTypesV10.js';
import type { ItemHeaderV11 } from './v11/readHeaderTypesV11.js';
import type { ItemHeaderV20 } from './v20/readHeaderTypesV20.js';

export type ItemMeta = Readonly<{
  signature: string;
  version: string;
  isPst: boolean;
  isPstee: boolean;
  isBg: boolean;
  isBgee: boolean;
  isBg2: boolean;
  isBg2ee: boolean;
  isIwd: boolean;
  isIwd2: boolean;
  isTobEx: boolean;
  isv10: boolean;
  isv11: boolean;
  isv20: boolean;
  isEe: boolean;
  hasKitIds: boolean;
  hasProftypeIds: boolean;
  resourceName: string;
  emptyInt: number;
}>;

export type ItemV10 = Readonly<{
  resourceName: string;
  header: ItemHeaderV10;
  extendedHeaders: ItemExtendedHeaderV10[];
  featureBlocks: ItemFeatureBlockV10[];
}>;

export type ItemV11 = Readonly<{
  resourceName: string;
  header: ItemHeaderV11;
  extendedHeaders: ItemExtendedHeaderV11[];
  featureBlocks: ItemFeatureBlockV11[];
}>;

export type ItemV20 = Readonly<{
  resourceName: string;
  header: ItemHeaderV20;
  extendedHeaders: ItemExtendedHeaderV20[];
  featureBlocks: ItemFeatureBlockV20[];
}>;
