import type { Maybe } from '../../../shared/types.js';

export type IdsParsed = Readonly<{
  type: 'IdsParsed';
  key: number;
  value: string;
}>;
export type SignatureParsed = Readonly<{
  type: 'SignatureParsed';
  wrongSignature: string;
}>;
export type EntryCountParsed = Readonly<{
  type: 'EntryCountParsed';
  wrongEntryCount: string;
}>;
export type FailedParsed = Readonly<{
  type: 'FailedParsed';
}>;
