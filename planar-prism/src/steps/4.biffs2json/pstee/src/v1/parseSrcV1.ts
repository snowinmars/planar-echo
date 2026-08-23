import { createReader } from '@/shared/bufferReader.js';

import type { RawSrc, RawSrcEntry } from '../parseSrcs.types.js';

type ParseSrcV1Props = Readonly<{
  buffer: Buffer;
  resourceName: string;
}>;

export const parseSrcV1 = ({
  buffer,
  resourceName,
}: ParseSrcV1Props): RawSrc => {
  const reader = createReader(buffer);
  const entryCount = reader.uint();

  const entries: RawSrcEntry[] = [];
  for (let i = 0; i < entryCount; i++) {
    const strref = reader.int();
    const weight = reader.int();

    entries.push({
      strref,
      weight,
    });
  }

  return {
    resourceName,
    header: {
      entryCount,
    },
    entries,
  };
};
