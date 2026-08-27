import { extendMap } from './4.parseSpawnPoints.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreSpawnPointV10 } from './4.parseSpawnPoints.types.js';

const parseSpawnPoint = (reader: BufferReader): RawAreSpawnPointV10 => {
  const name = reader.nullTerminatedString(32);
  const x = reader.ushort();
  const y = reader.ushort();
  const rawCreatures: string[] = [];
  for (let i = 0; i < 10; i++) rawCreatures.push(reader.string(8));
  const creaturesCount = reader.ushort();
  const encounterDifficulty = reader.ushort();
  const spawnRate = reader.ushort();
  const method = reader.map.ushort(extendMap.spawnMethod.parseFlags);
  const duration = reader.int();
  const wanderDistance = reader.ushort();
  const followDistance = reader.ushort();
  const maxCreatures = reader.ushort();
  const enabled = reader.ushort() === 1;
  const presentedAt = reader.map.uint(extendMap.presentedAtFlags.parseFlags);
  const probabilityDay = reader.ushort();
  const probabilityNight = reader.ushort();
  const frequency = reader.uint();
  const countdown = reader.uint();
  const weights: number[] = [];
  for (let i = 0; i < 10; i++) weights.push(reader.ubyte());
  reader.skip.custom(38);

  const rawAreSpawnPointV10: RawAreSpawnPointV10 = {
    name,
    at: {
      x,
      y,
    },
    creatures: rawCreatures.slice(0, creaturesCount),
    creaturesCount,
    encounterDifficulty,
    spawnRate,
    method,
    duration,
    wanderDistance,
    followDistance,
    maxCreatures,
    enabled,
    presentedAt,
    probabilityDay,
    probabilityNight,
    frequency,
    countdown,
    weights,
  };

  return rawAreSpawnPointV10;
};

type ParseSpawnPointsProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseSpawnPoints = ({
  reader,
  count,
}: ParseSpawnPointsProps): RawAreSpawnPointV10[] => {
  const spawnPoints: RawAreSpawnPointV10[] = [];

  for (let i = 0; i < count; i++) spawnPoints.push(parseSpawnPoint(reader));

  return spawnPoints;
};
