import { offsetMap } from './readExtendedHeaderTypesV11.js';
import type { BufferReader } from '../../../../pipes/readers.js';
import type { ItemExtendedHeaderV11 } from './readExtendedHeaderTypesV11.js';
import type { ItemMeta } from '../readItemBufferTypes.js';
import type { PartialWriteable } from '../../../../shared/types.js';

const readExtendedHeaderV11 = (reader: BufferReader, meta: ItemMeta): ItemExtendedHeaderV11 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.1.htm

  const tmp: PartialWriteable<ItemExtendedHeaderV11> = {};

  tmp.attackType = reader.map.byte(offsetMap.attackType.parse);
  tmp.idRequired = reader.map.byte(offsetMap.idRequired.parseFlags);
  tmp.location = reader.map.byte(offsetMap.location.parse);
  tmp.alternativeDiceSides = reader.byte();
  tmp.useIcon = reader.string(8);
  tmp.targetType = reader.map.byte(offsetMap.targetType.parse);
  tmp.targetCount = reader.byte();
  tmp.range = reader.short();
  tmp.projectileType = reader.map.byte(offsetMap.projectileType.parse);
  tmp.alternativeDiceThrown = reader.byte();
  tmp.speed = reader.byte();
  tmp.alternativeDamageBonus = reader.byte();
  tmp.thac0bonus = reader.short();
  tmp.diceSides = reader.byte();
  tmp.primaryType = reader.byte();
  tmp.diceThrown = reader.byte();
  tmp.secondaryType = reader.byte();
  tmp.damageBonus = reader.short();
  tmp.damageType = reader.map.short(offsetMap.damageType.parse);
  tmp.countOfFeatureBlocks = reader.short();
  tmp.indexIntoFeatureBlocks = reader.short();
  tmp.charges = reader.short();
  tmp.chargeDepletionBehaviour = reader.map.short(offsetMap.chargeDepletionBehaviour.parse);
  tmp.flags = reader.map.uint(offsetMap.flags.parseFlags);
  tmp.projectileAnimation = reader.short();
  tmp.meleeAnimation1 = reader.short();
  tmp.meleeAnimation2 = reader.short();
  tmp.meleeAnimation3 = reader.short();

  reader.skip.short();
  reader.skip.short();
  reader.skip.short();

  return {
    attackType: tmp.attackType,
    idRequired: tmp.idRequired,
    location: tmp.location,
    alternativeDiceSides: tmp.alternativeDiceSides,
    useIcon: tmp.useIcon,
    targetType: tmp.targetType,
    targetCount: tmp.targetCount,
    range: tmp.range,
    projectileType: tmp.projectileType,
    alternativeDiceThrown: tmp.alternativeDiceThrown,
    speed: tmp.speed,
    alternativeDamageBonus: tmp.alternativeDamageBonus,
    thac0bonus: tmp.thac0bonus,
    diceSides: tmp.diceSides,
    primaryType: tmp.primaryType,
    diceThrown: tmp.diceThrown,
    secondaryType: tmp.secondaryType,
    damageBonus: tmp.damageBonus,
    damageType: tmp.damageType,
    countOfFeatureBlocks: tmp.countOfFeatureBlocks,
    indexIntoFeatureBlocks: tmp.indexIntoFeatureBlocks,
    charges: tmp.charges,
    chargeDepletionBehaviour: tmp.chargeDepletionBehaviour,
    flags: tmp.flags,
    projectileAnimation: tmp.projectileAnimation,
    meleeAnimation1: tmp.meleeAnimation1,
    meleeAnimation2: tmp.meleeAnimation2,
    meleeAnimation3: tmp.meleeAnimation3,
    featureBlocks: [],
  };
};

export default readExtendedHeaderV11;
