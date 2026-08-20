import type { RawCre, RawCreV10 } from '@/steps/4.biffs2json/pstee/cre/parseCres.types.js';

export const isRawCreV10 = (x: RawCre): x is RawCreV10 => x.header.version === 'v1.0';
