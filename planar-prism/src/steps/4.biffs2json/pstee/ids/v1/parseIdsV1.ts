import createReader from '@/shared/bufferReader.js';
import { parseKeyValueV1 } from './parsers/index.js';

import type { RawIds } from '../parseIds.types.js';

type ParseIdsV1Props = Readonly<{
  buffer: Buffer;
  resourceName: string;
}>;
export const parseIdsV1 = ({
  buffer,
  resourceName,
}: ParseIdsV1Props): RawIds => {
  const reader = createReader(buffer);
  const parsed = parseKeyValueV1({
    lines: reader.readLineByLine(),
    resourceName,
  });

  const entries = parsed.ids.reduce((map, { key, value }) => {
    const existing = map.get(key) ?? [];
    map.set(key, [...existing, value]);
    return map;
  }, new Map<number, string[]>());

  return {
    resourceName,
    header: {
      wrongSignature: parsed.wrongSignarute,
      wrongEntryCount: parsed.wrongEntriesCount,
    },
    entries,
  };
};
