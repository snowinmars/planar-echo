import { extendMap } from './9.parseAmbients.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreAmbientV10 } from './9.parseAmbients.types.js';

const parseAmbient = (reader: BufferReader): RawAreAmbientV10 => {
  const name = reader.nullTerminatedString(32); // TODO [snow]: in bytecode there is tail after null terminator. Why?
  const x = reader.ushort();
  const y = reader.ushort();
  const radius = reader.ushort();
  const height = reader.ushort();
  const pitchVariation = reader.uint();
  const volumeVariation = reader.ushort();
  const volume = reader.ushort();
  const rawSounds: string[] = [];
  for (let i = 0; i < 10; i++) rawSounds.push(reader.string(8));
  const soundsCount = reader.ushort();
  reader.skip.custom(2);
  const intervalBase = reader.uint();
  const intervalVariation = reader.uint();
  const presentedAt = reader.map.uint(extendMap.presentedAtFlags.parseFlags);
  const flags = reader.map.uint(extendMap.ambientFlags.parseFlags);
  reader.skip.custom(64);

  const rawAreAmbientV10: RawAreAmbientV10 = {
    name,
    at: {
      x,
      y,
    },
    radius,
    height,
    pitchVariation,
    volumeVariation,
    volume,
    sounds: rawSounds.slice(0, soundsCount),
    soundsCount,
    intervalBase,
    intervalVariation,
    presentedAt,
    flags,
  };

  return rawAreAmbientV10;
};

type ParseAmbientsProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseAmbients = ({
  reader,
  count,
}: ParseAmbientsProps): RawAreAmbientV10[] => {
  const ambients: RawAreAmbientV10[] = [];

  for (let i = 0; i < count; i++) ambients.push(parseAmbient(reader));

  return ambients;
};
