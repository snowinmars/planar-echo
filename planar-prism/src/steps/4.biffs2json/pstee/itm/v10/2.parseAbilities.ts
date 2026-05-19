import { extendMap } from './2.parseAbilities.types.js';
import { parseEffect } from './3.parseEffects.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { AbilityV10 } from './2.parseAbilities.types.js';
import type { EffectV10 } from './3.parseEffects.types.js';

const parseAbilityEffects = (reader: BufferReader, count: number, index: number): EffectV10[] => {
  const abilityEffectSize = 48;
  const abilityEffects: EffectV10[] = [];
  // TODO [snow]: I may have a bug here: choose index vs i
  for (let i = 0; i < count; i++) {
    const abilityEffect = parseEffect(reader.fork(reader.offset + i * abilityEffectSize));
    abilityEffects.push(abilityEffect);
  }

  return abilityEffects;
};

const parseAbility = (reader: BufferReader, offsetToEffects: number): AbilityV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.1.htm

  const attackType = reader.map.byte(extendMap.attackType.parse);
  const typeFlags = reader.map.byte(extendMap.typeFlags.parseFlags);
  const abilityLocation = reader.map.byte(extendMap.abilityLocation.parse);
  const alternativeDiceSides = reader.byte();
  const useIcon = reader.string(8);
  const targetType = reader.map.byte(extendMap.targetType.parse);
  const targetCount = reader.byte();
  const range = reader.short();
  const projectileType = reader.map.byte(extendMap.projectileType.parse);
  const alternativeDiceThrown = reader.byte();
  const speed = reader.byte();
  const alternativeDamageBonus = reader.byte();
  const thac0bonus = reader.short();
  const diceSides = reader.byte();
  const primaryType = reader.byte();
  const diceThrown = reader.byte();
  const secondaryType = reader.byte();
  const damageBonus = reader.short();
  const damageType = reader.map.short(extendMap.damageType.parse);
  const countOfEffects = reader.short();
  const firstEffectIndex = reader.short();
  const charges = reader.short();
  const chargeDepletionBehaviour = reader.map.short(extendMap.chargeDepletionBehaviour.parse);
  const flags = reader.map.uint(extendMap.flags.parseFlags);
  const projectileAnimation = reader.short();
  const overhandSwingAnimation = reader.short();
  const backhandSwingAnimation = reader.short();
  const thrustAnimation = reader.short();
  const isArrow = reader.short();
  const isBolt = reader.short();
  const isBullet = reader.short();

  const sizeOfAbilityEffectBytes = 48;
  const thisAbilityEffectsOffset = offsetToEffects + sizeOfAbilityEffectBytes * firstEffectIndex;
  const effects = parseAbilityEffects(reader.fork(thisAbilityEffectsOffset), countOfEffects, firstEffectIndex);

  reader.skip.short();
  reader.skip.short();
  reader.skip.short();

  return {
    attackType,
    typeFlags,
    abilityLocation,
    alternativeDiceSides,
    useIcon,
    targetType,
    targetCount,
    range,
    projectileType,
    alternativeDiceThrown,
    speed,
    alternativeDamageBonus,
    thac0bonus,
    diceSides,
    primaryType,
    diceThrown,
    secondaryType,
    damageBonus,
    damageType,
    countOfEffects,
    firstEffectIndex,
    charges,
    chargeDepletionBehaviour,
    flags,
    projectileAnimation,
    overhandSwingAnimation,
    backhandSwingAnimation,
    thrustAnimation,
    isArrow,
    isBolt,
    isBullet,
    effects,
  };
};

type ParseAbilitiesProps = Readonly<{
  reader: BufferReader;
  count: number;
  offsetToEffects: number;
}>;
export const parseAbilities = ({
  reader,
  count,
  offsetToEffects,
}: ParseAbilitiesProps): AbilityV10[] => {
  const abilitySize = 56;
  return Array.from<never, AbilityV10>({ length: count }, (_, i) => parseAbility(reader.fork(reader.offset + i * abilitySize), offsetToEffects));
};
