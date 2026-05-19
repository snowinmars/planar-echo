import { parseHeader } from './1.parseHeader.js';
import { parseAbilities } from './2.parseAbilities.js';
import { parseEffects } from './3.parseEffects.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { ItmV10 } from '../types.js';

type ParseItmV10Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseItmV10 = ({
  reader,
  resourceName,
}: ParseItmV10Props): ItmV10 => {
  const header = parseHeader(reader);

  const abilities = parseAbilities({
    reader: reader.fork(header.offsetToAbilities),
    count: header.countOfAbilities,
    offsetToEffects: header.offsetToEffects,
  });

  const effects = parseEffects({
    reader: reader.fork(header.offsetToEffects),
    count: header.countOfGlobalEffects,
  });

  return {
    resourceName,
    header,
    abilities,
    effects,
  };
};
