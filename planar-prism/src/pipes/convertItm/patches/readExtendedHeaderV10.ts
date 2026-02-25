import { offsetMap } from './readExtendedHeaderTypesV10.js';

import type { PartialWriteable } from '../../../shared/types.js';
import type { BufferReader } from '../../../pipes/readers.js';
import type { ItemMeta } from './readItemBufferTypes.js';
import type { ItemExtendedHeaderV10 } from './readExtendedHeaderTypesV10.js';

const readExtendedHeaderV10 = (reader: BufferReader, meta: ItemMeta): ItemExtendedHeaderV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.htm#Header_Proficiency

  const tmp: PartialWriteable<ItemExtendedHeaderV10> = {};

  tmp.attackType = reader.map.byte(offsetMap.attackType.parse);
  tmp.idRequired = reader.map.byte(offsetMap.idRequired.parseFlags);
  tmp.location = reader.map.byte(offsetMap.location.parse, offsetMap.location[0]);
  tmp.alternativeDiceSides = reader.byte();
  tmp.useIcon = reader.string(8);
  tmp.targetType = reader.map.byte(offsetMap.targetType.parse);
  tmp.targetCount = reader.byte();
  tmp.range = reader.short();
  tmp.launcherRequired = reader.map.byte(offsetMap.launcherRequired.parse);
  tmp.alternativeDiceThrown = reader.byte();
  tmp.speedFactor = reader.byte();
  tmp.alternativeDamageBonus = reader.byte();
  tmp.thac0bonus = reader.short();
  tmp.diceSides = reader.byte();
  tmp.primaryType = reader.byte();
  tmp.diceThrown = reader.byte();
  tmp.secondaryType = reader.byte();
  tmp.damageBonus = reader.short();
  tmp.damageType = reader.map.short(offsetMap.damageType.parse, offsetMap.damageType[0]);
  tmp.countOfFeatureBlocks = reader.short();
  tmp.indexIntoFeatureBlocks = reader.short();
  tmp.maxCharges = reader.short();
  tmp.chargeDepletionBehaviour = reader.map.short(offsetMap.chargeDepletionBehaviour.parse);
  tmp.flags = reader.map.uint(offsetMap.flags.parseFlags);
  tmp.projectileAnimation = reader.short();
  tmp.meleeAnimation1 = reader.short();
  tmp.meleeAnimation2 = reader.short();
  tmp.meleeAnimation3 = reader.short();
  tmp.bowArrowQualifier = reader.boolean.short(meta.resourceName);
  tmp.crossbowBoltQualifier = reader.boolean.short(meta.resourceName);
  tmp.miscProjectileQualifier = reader.boolean.short(meta.resourceName);

  return {
    attackType: tmp.attackType,
    idRequired: tmp.idRequired,
    location: tmp.location,
    alternativeDiceSides: tmp.alternativeDiceSides,
    useIcon: tmp.useIcon,
    targetType: tmp.targetType,
    targetCount: tmp.targetCount,
    range: tmp.range,
    launcherRequired: tmp.launcherRequired,
    alternativeDiceThrown: tmp.alternativeDiceThrown,
    speedFactor: tmp.speedFactor,
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
    maxCharges: tmp.maxCharges,
    chargeDepletionBehaviour: tmp.chargeDepletionBehaviour,
    flags: tmp.flags,
    projectileAnimation: tmp.projectileAnimation,
    meleeAnimation1: tmp.meleeAnimation1,
    meleeAnimation2: tmp.meleeAnimation2,
    meleeAnimation3: tmp.meleeAnimation3,
    bowArrowQualifier: tmp.bowArrowQualifier,
    crossbowBoltQualifier: tmp.crossbowBoltQualifier,
    miscProjectileQualifier: tmp.miscProjectileQualifier,
    featureBlocks: [],
  };
};

export default readExtendedHeaderV10;
