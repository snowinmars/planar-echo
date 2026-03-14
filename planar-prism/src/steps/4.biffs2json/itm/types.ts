import type { HeaderV10 } from './v10.types/1.header.js';
import type { ExtendedHeaderV10 } from './v10.types/2.extendedHeader.js';
import type { FeatureBlockV10 } from './v10.types/3.featureBlock.js';

import type { HeaderV11 } from './v11.types/1.header.js';
import type { ExtendedHeaderV11 } from './v11.types/2.extendedHeader.js';
import type { FeatureBlockV11 } from './v11.types/3.featureBlock.js';

import type { HeaderV20 } from './v20.types/1.header.js';
import type { ExtendedHeaderV20 } from './v20.types/2.extendedHeader.js';
import type { FeatureBlockV20 } from './v20.types/3.featureBlock.js';

export type Signature = 'itm';
export type Versions = 'v1' | 'v11' | 'v20';

export type ItmV10 = Readonly<{
  resourceName: string;
  header: HeaderV10;
  extendedHeaders: ExtendedHeaderV10[];
  featureBlocks: FeatureBlockV10[];
}>;

export type ItmV11 = Readonly<{
  resourceName: string;
  header: HeaderV11;
  extendedHeaders: ExtendedHeaderV11[];
  featureBlocks: FeatureBlockV11[];
}>;

export type ItmV20 = Readonly<{
  resourceName: string;
  header: HeaderV20;
  extendedHeaders: ExtendedHeaderV20[];
  featureBlocks: FeatureBlockV20[];
}>;
