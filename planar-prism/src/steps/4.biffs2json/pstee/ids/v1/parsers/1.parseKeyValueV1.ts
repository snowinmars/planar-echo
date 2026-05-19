import type { ParsedIds } from './1.parseKeyValueV1.types.js';

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

type ParseKeyValueV1Props = Readonly<{
  lines: IterableIterator<string>;
  resourceName: string;
}>;
export const parseKeyValueV1 = ({
  lines,
  resourceName,
}: ParseKeyValueV1Props): ParsedIds => {
  const ids: ParsedIds['ids'] = [];
  let wrongSignarute: ParsedIds['wrongSignarute'] = '';
  let wrongEntriesCount: ParsedIds['wrongEntriesCount'] = '';

  for (const line of lines) {
    const isEmptyLine = !line;
    if (isEmptyLine) continue;

    const l = line.split('//')[0]?.trim();
    const isCommentLine = !l;
    if (isCommentLine) continue;

    const isSignaruteLine = isSignatureLineRegex.test(line);
    if (isSignaruteLine) {
      if (wrongSignarute) throw new Error(`WrongSignarute value already set to '${wrongSignarute}' at resource '${resourceName}'`);
      wrongSignarute = line;
      continue;
    }

    const isCountLine = isCountLineRegex.test(line);
    if (isCountLine) {
      if (wrongEntriesCount) throw new Error(`WrongEntriesCount value already set to '${wrongEntriesCount}' at resource '${resourceName}'`);
      wrongEntriesCount = line;
      continue;
    }

    // line cannot be anything but ids line here
    // but I still do not get, what is wrong with the devs
    const normalMatch = line.match(normalMatchRegex);
    const reverseMatch = line.match(reverseMatchRegex);

    const [key, value] = parseKey(line, resourceName, normalMatch, reverseMatch);

    ids.push({
      key,
      value,
    });
  }

  return {
    ids,
    wrongEntriesCount,
    wrongSignarute,
  };
};
