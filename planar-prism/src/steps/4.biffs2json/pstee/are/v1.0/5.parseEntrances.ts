import { parseDirection } from '../../shared/parseDirection.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreEntranceV10 } from './5.parseEntrances.types.js';

const parseEntrance = (reader: BufferReader): RawAreEntranceV10 => {
  const name = reader.nullTerminatedString(32);// TODO [snow]: in bytecode there is tail after null terminator. Why?
  const x = reader.ushort();
  const y = reader.ushort();
  const direction = reader.map.ushort(x => parseDirection(x));
  reader.skip.custom(66);

  const rawAreEntranceV10: RawAreEntranceV10 = {
    name,
    at: {
      x,
      y,
    },
    direction,
  };

  return rawAreEntranceV10;
};

type ParseEntrancesProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseEntrances = ({
  reader,
  count,
}: ParseEntrancesProps): RawAreEntranceV10[] => {
  const entrances: RawAreEntranceV10[] = [];

  for (let i = 0; i < count; i++) entrances.push(parseEntrance(reader));

  return entrances;
};
