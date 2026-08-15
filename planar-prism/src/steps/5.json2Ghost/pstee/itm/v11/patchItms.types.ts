import type { RawItmV10 } from '@/steps/4.biffs2json/pstee/itm/index.js';

export type ItmWithTlk = RawItmV10 & Readonly<{
  header: RawItmV10['header'] & Readonly<{
    unidentifiedNameTlk: string;
    identifiedNameTlk: string;
    unidentifiedDescriptionTlk: string;
    identifiedDescriptionTlk: string;
  }>;
}>;

export type ItmOut = Readonly<{
  resourceName: string;
  skeleton: string;
  itm: ItmWithTlk;
}>;
