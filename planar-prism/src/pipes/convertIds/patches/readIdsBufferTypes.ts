import type { Maybe } from '../../../shared/types.js';

export type IdsHeader = {
  wrongSignature: Maybe<string>;
  wrongEntryCount: Maybe<string>;
};

export type Ids = Readonly<{
  resourceName: string;
  header: IdsHeader;
  entries: Map<number, string[]>;
}>;
