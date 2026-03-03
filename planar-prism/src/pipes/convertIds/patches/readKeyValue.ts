import type { IdsParsed, SignatureParsed, EntryCountParsed, FailedParsed } from './readKeyValueTypes.js';

type Parsed = IdsParsed | SignatureParsed | EntryCountParsed | FailedParsed;

const failedParsed: FailedParsed = {
  type: 'FailedParsed',
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

const readKeyValue = (line: string, resourceName: string): Parsed => {
  const isEmptyLine = !line;
  if (isEmptyLine) return failedParsed;

  const l = line.split('//')[0]?.trim();
  const isCommentLine = !l;
  if (isCommentLine) return failedParsed;

  const isSignaruteLine = /^ids\s*(v\d+\.\d+)?$/i.test(line);
  if (isSignaruteLine) {
    const headerParsed: SignatureParsed = {
      type: 'SignatureParsed',
      wrongSignature: line,
    };
    return headerParsed;
  }

  const isCountLine = /^-?\d+$/.test(line);
  if (isCountLine) {
    const entryCountParsed: EntryCountParsed = {
      type: 'EntryCountParsed',
      wrongEntryCount: line,
    };
    return entryCountParsed;
  }

  // line cannot be anything but ids line here
  // but I still do not get, what is wrong with devs
  const normalMatch = line.match(/^(0x[0-9A-F]+|-?\d+)\s+(.*?)$/i);
  const reverseMatch = line.match(/^(.*?)\s+(0x[0-9a-f]+|-?\d+)$/i);

  const [key, value] = parseKey(line, resourceName, normalMatch, reverseMatch);

  const idsParsed: IdsParsed = {
    type: 'IdsParsed',
    key,
    value,
  };
  return idsParsed;
};

export default readKeyValue;
