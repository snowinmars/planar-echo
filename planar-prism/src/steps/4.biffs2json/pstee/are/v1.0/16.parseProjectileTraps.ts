import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreProjectileTrapV10 } from './16.parseProjectileTraps.types.js';

const parseProjectileTrap = (reader: BufferReader): RawAreProjectileTrapV10 => {
  const projectile = reader.string(8);
  const effectBlockOffset = reader.uint();
  const effectBlockSize = reader.ushort();
  const missileId = reader.ushort();
  const ticksUntilCheck = reader.ushort();
  const triggersRemaining = reader.ushort();
  const x = reader.ushort();
  const y = reader.ushort();
  const z = reader.ushort();
  const enemyAlly = reader.ubyte();
  const indexOfPartyMemberWhoCreatedIt = reader.ubyte();

  const rawAreProjectileTrapV10: RawAreProjectileTrapV10 = {
    projectile,
    effectBlockOffset,
    effectBlockSize,
    missileId,
    ticksUntilCheck,
    triggersRemaining,
    x,
    y,
    z,
    enemyAlly,
    indexOfPartyMemberWhoCreatedIt,
  };

  return rawAreProjectileTrapV10;
};

type ParseProjectileTrapsProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseProjectileTraps = ({
  reader,
  count,
}: ParseProjectileTrapsProps): RawAreProjectileTrapV10[] => {
  const traps: RawAreProjectileTrapV10[] = [];

  for (let i = 0; i < count; i++) traps.push(parseProjectileTrap(reader));

  return traps;
};
