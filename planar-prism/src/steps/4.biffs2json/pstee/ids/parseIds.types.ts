import type { Maybe } from '@planar/shared';

export type RawIds = Readonly<{
  resourceName: string;
  header: Readonly<{
    wrongSignature: Maybe<string>;
    wrongEntryCount: Maybe<number>;
  }>;
  entries: Map<number, string[]>;
}>;
