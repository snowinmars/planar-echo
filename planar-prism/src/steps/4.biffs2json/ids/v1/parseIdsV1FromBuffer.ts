import createReader from '../../../../pipes/readers.js';
import parseKeyValueV1 from './parsers/parseKeyValueV1.js';

import type {
  Ids,
  IdsParsed,
  SignatureParsed,
  EntryCountParsed,
  FailedParsed,
} from '../types.js';

type Parsed = IdsParsed | SignatureParsed | EntryCountParsed | FailedParsed;

const isIdsParsed = (parsed: Parsed): parsed is IdsParsed => parsed.type === 'idsParsed';
const isSignatureParsed = (parsed: Parsed): parsed is SignatureParsed => parsed.type === 'signatureParsed';
const isEntryCountParsed = (parsed: Parsed): parsed is EntryCountParsed => parsed.type === 'entryCountParsed';

const parseIdsV1FromBuffer = (buffer: Buffer, resourceName: string): Ids => {
  const reader = createReader(buffer);
  const parseResults = Array.from(reader.readLineByLine()).map(line => parseKeyValueV1(line, resourceName));
  const idsEntries = parseResults.filter(isIdsParsed);
  const signatureLine = parseResults.find(isSignatureParsed);
  const countLine = parseResults.find(isEntryCountParsed);

  const entries = idsEntries.reduce((map, { key, value }) => {
    const existing = map.get(key) ?? [];
    map.set(key, [...existing, value]);
    return map;
  }, new Map<number, string[]>());

  return {
    resourceName,
    header: {
      wrongSignature: signatureLine?.wrongSignature ?? 'n/a',
      wrongEntryCount: countLine?.wrongEntryCount ?? 'n/a',
    },
    entries,
  };
};

export default parseIdsV1FromBuffer;
