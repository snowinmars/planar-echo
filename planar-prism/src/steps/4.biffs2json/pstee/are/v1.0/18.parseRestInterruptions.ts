import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawAreRestInterruptionsV10 } from './18.parseRestInterruptions.types.js';

export const parseRestInterruptions = (reader: BufferReader): RawAreRestInterruptionsV10 => {
  const name = reader.nullTerminatedString(32);
  const explanationRefs: number[] = [];
  for (let i = 0; i < 10; i++) explanationRefs.push(reader.int());
  const rawCreatures: string[] = [];
  for (let i = 0; i < 10; i++) rawCreatures.push(reader.string(8));
  const creaturesCount = reader.ushort();
  const difficulty = reader.ushort();
  const removalTime = reader.uint();
  const wanderDistance = reader.ushort();
  const followDistance = reader.ushort();
  const maxCreatures = reader.ushort();
  const enabled = reader.ushort() === 1;
  const probabilityDay = reader.ushort();
  const probabilityNight = reader.ushort();
  reader.skip.custom(56);

  return {
    name,
    explanationRefs,
    creatures: rawCreatures.slice(0, creaturesCount),
    creaturesCount,
    difficulty,
    removalTime,
    wanderDistance,
    followDistance,
    maxCreatures,
    enabled,
    probabilityDay,
    probabilityNight,
  };
};
