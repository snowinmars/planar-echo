import type { Maybe } from '@planar/shared';

export type Ids = Readonly<{
  resourceName: string;
  header: Readonly<{
    wrongSignature: Maybe<string>;
    wrongEntryCount: Maybe<string>;
  }>;
  entries: Map<number, string[]>;
}>;
