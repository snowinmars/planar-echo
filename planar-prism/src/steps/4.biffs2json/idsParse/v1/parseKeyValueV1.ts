import type {
  IdsParsed,
  SignatureParsed,
  EntryCountParsed,
  FailedParsed,
} from '../types.js';

type Parsed = IdsParsed | SignatureParsed | EntryCountParsed | FailedParsed;

const failedParsed: FailedParsed = {
  type: 'failedParsed',
};

const parseKey = (line: string, resourceName: string, normalMatch: RegExpMatchArray | null, reverseMatch: RegExpMatchArray | null): [number, string] => {
  if (normalMatch) {
    const strKey = normalMatch[1];
    if (!strKey) throw new Error(`Cannot parse id key in line '${line}' in file '${resourceName}'`);
    const radix = strKey.toLowerCase().startsWith('0x') ? 16 : 10;
    const key = parseInt(strKey, radix);

    const value = normalMatch[2];
    if (!value) throw new Error(`Cannot parse id value in line '${line}' in file '${resourceName}'`);

    return [key, value];
  }

  if (reverseMatch) {
    const strKey = reverseMatch[2];
    if (!strKey) throw new Error(`Cannot parse id key in line '${line}' in file '${resourceName}'`);
    const radix = strKey.toLowerCase().startsWith('0x') ? 16 : 10;
    const key = parseInt(strKey, radix);

    const value = reverseMatch[1];
    if (!value) throw new Error(`Cannot parse id value in line '${line}' in file '${resourceName}'`);

    return [key, value];
  }

  throw new Error(`Cannot parse ids line '${line}' in file '${resourceName}'`);
};

const isSignatureLineRegex = /^ids\s*(v\d+\.\d+)?$/i;
const isCountLineRegex = /^-?\d+$/;
const normalMatchRegex = /^(0x[0-9A-F]+|-?\d+)\s+(.*?)$/i;
const reverseMatchRegex = /^(.*?)\s+(0x[0-9a-f]+|-?\d+)$/i;

const parseKeyValueV1 = (line: string, resourceName: string): Parsed => {
  const isEmptyLine = !line;
  if (isEmptyLine) return failedParsed;

  ////

  const l = line.split('//')[0]?.trim();
  const isCommentLine = !l;
  if (isCommentLine) return failedParsed;

  ////

  const isSignaruteLine = isSignatureLineRegex.test(line);
  if (isSignaruteLine) return {
    type: 'signatureParsed',
    wrongSignature: line,
  };

  ////

  const isCountLine = isCountLineRegex.test(line);
  if (isCountLine) return {
    type: 'entryCountParsed',
    wrongEntryCount: line,
  };

  // line cannot be anything but ids line here
  // but I still do not get, what is wrong with devs
  const normalMatch = line.match(normalMatchRegex);
  const reverseMatch = line.match(reverseMatchRegex);

  const [key, value] = parseKey(line, resourceName, normalMatch, reverseMatch);

  return {
    type: 'idsParsed',
    key,
    value,
  };
};

export default parseKeyValueV1;
