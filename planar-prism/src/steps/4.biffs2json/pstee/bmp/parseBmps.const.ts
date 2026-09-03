import { isNothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

export const BMP_FILE_HEADER_SIZE = 14;
export const BMP_V1_HEADER_SIZE = 40;
export const BMP_V3_HEADER_SIZE = 56;
export const BMP_V4_HEADER_SIZE = 108;
export const BMP_V5_HEADER_SIZE = 124;

export const BMP_COMPRESSION_BITFIELDS = 3;

export const isBmpPalettedArtifacts = (x: Readonly<{ palette?: Maybe<Buffer>; indices?: Maybe<Buffer> }>): x is Readonly<{ palette: Buffer; indices: Buffer }> => !isNothing(x.palette) && !isNothing(x.indices);
