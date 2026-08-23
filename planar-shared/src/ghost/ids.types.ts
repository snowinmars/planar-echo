import type { Maybe } from '../maybe.js';

export type GhostIds = Readonly<{
  resourceName: string;
  header: Readonly<{
    wrongSignature?: Maybe<string>;
    wrongEntryCount?: Maybe<number>;
  }>;
  entries: Map<number, string[]>;
}>;
