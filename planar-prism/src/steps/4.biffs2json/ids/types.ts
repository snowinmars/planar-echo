import type { Maybe } from '@planar/shared';

export type IdsHeader = Readonly<{
  wrongSignature: Maybe<string>;
  wrongEntryCount: Maybe<string>;
}>;

export type Ids = Readonly<{
  resourceName: string;
  header: IdsHeader;
  entries: Map<number, string[]>;
}>;

export type IdsParsed = Readonly<{
  type: 'idsParsed';
  key: number;
  value: string;
}>;
export type SignatureParsed = Readonly<{
  type: 'signatureParsed';
  wrongSignature: string;
}>;
export type EntryCountParsed = Readonly<{
  type: 'entryCountParsed';
  wrongEntryCount: string;
}>;
export type FailedParsed = Readonly<{
  type: 'failedParsed';
}>;
