import type { Maybe } from '../maybe.js';

export type GhostIds = Readonly<{
  resourceName: string;
  header: Readonly<{
    wrongSignature?: Maybe<string>;
    wrongEntryCount?: Maybe<string>;
  }>;
  entries: Map<number, string[]>;
}>;
