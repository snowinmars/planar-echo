// import type { GameName, PartialWriteable } from 'src/shared/types.js';
// import createReader, { type BufferReader } from '../../../pipes/readers.js';
// import type { Item, ItemAbility, ItemEffect, ItemHeader, ItemMeta } from '../types.js';
// import { offsetMap } from '../enums.js';

// const readHeaderV1 = (
//     reader: BufferReader,
//     resourceName: string,
//     gameName: GameName
// ): ItemHeader => {
//   const tmp: PartialWriteable<ItemHeader> = {};

//   tmp.signature        = reader.string(4).trim();
//   tmp.version          = reader.string(4).trim();

//   const meta: ItemMeta = formMeta(gameName, tmp.version, resourceName);

//   tmp.unidentifiedNameRef = reader.uint();
//   tmp.identifiedNameRef   = reader.uint();
//   if ()

//   return {
//     signature,
//     version,
//   };
// };

// const formMeta = (gameName: GameName, version: string, resourceName: string): ItemMeta => {
//   /* eslint-disable @stylistic/no-multi-spaces */
//     const isPstee        = gameName === 'pstee';
//     const isPstEngine    = true;
//     const isIwdEngine    = false;
//     const isIwd2Engine   = false;
//     const isBg2Engine    = false;
//     const isTobEx        = false;
//     const isEe           = gameName === 'pstee'; // TODO [snow]: or other ee games
//     const isv10          = version === 'v1';
//     const isv11          = version === 'v1.1';
//     const isv20          = version === 'v2.0';
//     const hasKitIds      = false;
//     const hasProftypeIds = false;
//   /* eslint-enable */

//     return {
//         isPstee,
//         isPstEngine,
//         isIwdEngine,
//         isIwd2Engine,
//         isBg2Engine,
//         isTobEx,
//         isEe,
//         isv10,
//         isv11,
//         isv20,
//         hasKitIds,
//         hasProftypeIds,
//         resourceName,
//     }
// }

// const readAbility = (reader: BufferReader, meta: ItemMeta): ItemAbility => {
//     if (meta.isBg2Engine || meta.isEe) {
//         const type = reader.map.byte(x => offsetMap.abstractAbilitlyType[x]);

//         const flags = reader.map.byte(x => offsetMap.abstractAbilitlyFlags[x]);

//         const location = reader.map.byte(x => offsetMap.itemAbilityUse[x]);

//         const alternateDiceSize = reader.byte();
//         const icon = reader.string(8);
//         const target = reader.map.byte(x => offsetMap.abstractAbilitlyTargetType[x]);
//         const targetsCount = reader.byte();
//         const range = reader.short();
//         const launcherRequired = reader.map.byte(x => offsetMap.itemAbilityLauncher[x]);
//         const alternateDiceThrownCount = reader.byte();
//         const speed = reader.byte();
//         const alternateDamageBonus = reader.byte();
//         const bonusToHit = reader.short();
//         const diceSize = reader.byte();
//         const primaryTypeSchool = reader.byte();
//         const thrownDicesCount = reader.byte();
//         const secondaryType = reader.byte();
//     } else {
//         const type = reader.map.byte(x => offsetMap.abstractAbilitlyType[x]);

//         const flags = reader.map.byte(x => offsetMap.abstractAbilitlyFlags[x]);

//         const location = reader.map.short(x => offsetMap.itemAbilityUse[x]);

//         const icon = reader.string(8);
//         const target = reader.map.short(x => offsetMap.abstractAbilitlyTargetType[x]);
//         const range = reader.short();
//         const launcherRequired = reader.map.short(x => offsetMap.itemAbilityLauncher[x]);
//         const speed = reader.short();
//         const diceSize = reader.short();
//         const bonusToHit = reader.short();
//         const thrownDicesCount = reader.short();
//     }

//     const damageBonus = reader.short();
//     const damageType = reader.map.short(x => offsetMap.abstractAbilitlyDamageType[x]);
//     const effectsCount = reader.short();
//     const firstEffectIndex = reader.short();
//     const chargesCount = reader.short();
//     const whenDrained = reader.short();
//     if (meta.isIwdEngine) {
//         const recharge = reader.map.uint(x => offsetMap.itemAbilityRechargeV20[x]);
//     } else if (meta.isPstEngine) {
//         const recharge = reader.map.uint(x => offsetMap.itemAbilityRechargeV11[x]);
//     } else {
//         const recharge = reader.map.uint(x => offsetMap.itemAbilityRecharge[x]);
//     }
//     if (meta.hasProftypeIds) {
//         const projectile = reader.map.short(x => offsetMap.abstractAbilitlyProjectile[x]);
//         // addField(new ProRef(buffer, offset + 42, ABILITY_PROJECTILE)); ?
//     } else if (meta.isPstEngine) {
//         const projectile = reader.map.short(x => offsetMap.abstractAbilitlyProjectilePst[x]);
//     } else if (meta.isIwdEngine || meta.isIwd2Engine) {
//         const projectile = reader.map.short(x => offsetMap.abstractAbilitlyProjectileIwd[x]);
//     } else {
//         const projectile = reader.map.short(x => offsetMap.abstractAbilitlyProjectile[x]);
//     }
//     const animationOverhandSwingPercent = reader.short();
//     const animationBackhandSwingPercent = reader.short();
//     const animationThrustPercent = reader.short();
//     const isArrow = reader.short();
//     const isBolt = reader.short();
//     const isBullet = reader.short();
// }

// const readEffectV1 = (reader: BufferReader, meta: ItemMeta): ItemEffect => {
//     // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v1.htm

//     const tmp: PartialWriteable<ItemEffect> = {};

//     tmp.effectType = reader.short();
//     tmp.typeTarget = reader.map.byte(x => offsetMap.abstractAbilitlyTargetType[x]!);
//     tmp.power = reader.byte();

//     tmp.parameter1 = reader.uint();
//     tmp.parameter2 = reader.uint();

//     tmp.timingMode = reader.map.byte(x => offsetMap.baseOpcodeDurationV1O[x]!);
//     tmp.dispelType = reader.map.byte(x => offsetMap.baseOpcodeDispelResistance[x]!);

//     tmp.duration = reader.uint();
//     tmp.probability1 = reader.byte();
//     tmp.probability2 = reader.byte();
//     tmp.resource = reader.string(8).trim();

//     tmp.diceThrownCountOrMaximumLevel = reader.uint();
//     tmp.diceSizeOrMinimumLevel = reader.uint();
//     if (meta.isIwd2Engine) {
//       tmp.saveType = reader.map.uint(x => offsetMap.baseOpcodeSaveTypeIwd2[x]!);
//       tmp.savePenalty = reader.uint();
//     } else {
//       tmp.saveType = meta.isTobEx ? reader.map.uint(x => offsetMap.baseOpcodeSaveTypeTobex[x]!) : reader.map.uint(x => offsetMap.baseOpcodeSaveType[x]!);
//       tmp.saveBonus = reader.uint();
//     }

//     if (meta.isBg2Engine && meta.isTobEx) {
//         tmp.effectIdentifier = reader.short();
//         tmp.effectPrefix = reader.short();
//     } else {
//         tmp.effectSpecial = reader.uint();
//     }

//     return {
//         effectType: tmp.effectType!,
//         typeTarget: tmp.typeTarget!,
//         power: tmp.power!,
//         parameter1: tmp.parameter1!,
//         parameter2: tmp.parameter2!,
//         timingMode: tmp.timingMode!,
//         dispelType: tmp.dispelType!,
//         duration: tmp.duration!,
//         probability1: tmp.probability1!,
//         probability2: tmp.probability2!,
//         resource: tmp.resource!,
//         diceThrownCountOrMaximumLevel: tmp.diceThrownCountOrMaximumLevel!,
//         diceSizeOrMinimumLevel: tmp.diceSizeOrMinimumLevel!,
//         diceThrownCount: null,
//         diceSize: null,
//         saveType: tmp.saveType!,
//         savePenalty: tmp.savePenalty!,
//         saveType: tmp.saveType!,
//         saveBonus: tmp.saveBonus!,
//         effectIdentifier: tmp.effectIdentifier!,
//         effectPrefix: tmp.effectPrefix!,
//         effectSpecial: tmp.effectSpecial!,
//     }
// };
// const readEffectV2 = (reader: BufferReader, meta: ItemMeta): ItemEffect => {
//   // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/eff_v2.htm

//   const tmp: PartialWriteable<ItemEffect> = {};

//   tmp.effectType = reader.short();
//   tmp.typeTarget = reader.map.uint(x => offsetMap.baseOpcodeEffectV2TargetType[x]!);
//   tmp.power = reader.uint();
//   tmp.parameter1 = reader.uint();
//   tmp.parameter2 = reader.uint();

//   tmp.timingMode  = reader.map.uint(x => offsetMap.baseOpcodeDurationV2O[x]!);
//   tmp.duration = reader.uint();
//   tmp.probability1 = reader.byte();
//   tmp.probability2 = reader.byte();
//   tmp.resource = reader.string(8).trim();

//   if (meta.isIwd2Engine) {
//     tmp.saveType = reader.map.uint(x => offsetMap.baseOpcodeSaveTypeIwd2[x]!);
//     tmp.savePenalty = reader.uint();
//     const _ = reader.uint();
//     const __ = reader.uint();
//   } else {
//     tmp.diceThrownCount = reader.uint();
//     tmp.diceSize = reader.uint();
//     tmp.saveType = meta.isTobEx ? reader.map.uint(x => offsetMap.baseOpcodeSaveTypeTobex[x]!) : reader.map.uint(x => offsetMap.baseOpcodeSaveType[x]!);
//     tmp.saveBonus = reader.uint();
//   }

//   if (meta.isBg2Engine && meta.isTobEx) {
//     tmp.effectIdentifier = reader.short();
//     tmp.effectPrefix = reader.short();
//   } else {
//     tmp.effectSpecial = reader.uint();
//   }

//   return {
//     effectType: tmp.effectType!,
//     typeTarget: tmp.typeTarget!,
//     power: tmp.power!,
//     parameter1: tmp.parameter1!,
//     parameter2: tmp.parameter2!,
//     timingMode: tmp.timingMode!,
//     dispelType: null,
//     duration: tmp.duration!,
//     probability1: tmp.probability1!,
//     probability2: tmp.probability2!,
//     resource: tmp.resource!,
//     saveType: tmp.saveType!,
//     savePenalty: tmp.savePenalty!,
//     diceThrownCountOrMaximumLevel: null,
//     diceSizeOrMinimumLevel: null,
//     diceThrownCount: tmp.diceThrownCount!,
//     diceSize: tmp.diceSize!,
//     saveType: tmp.saveType!,
//     saveBonus: tmp.saveBonus!,
//     effectIdentifier: tmp.effectIdentifier!,
//     effectPrefix: tmp.effectPrefix!,
//     effectSpecial: tmp.effectSpecial!,
//   }
// };

// const readEffect = (reader: BufferReader, meta: ItemMeta): ItemEffect => {
//     const isEffectV1 = true; // was called after readShort
//     const isEffectV2 = false; // was called after readUint
//     if (isEffectV1) return readEffectV1(reader, meta);
//     if (isEffectV2) return readEffectV2(reader, meta);
//     throw new Error(`Unknown effect header`);
// }

// const readItemV10 = (reader: BufferReader, meta: ItemMeta): Item => {
//   // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/itm_v1.htm

//   /* eslint-disable @stylistic/no-multi-spaces */
//   const generalNameRef    = reader.uint();
//   const identifiedNameRef = reader.uint();
//   /* eslint-enable */

//     const usedUpItem = reader.string(8);
//     const flags = reader.uint();
//     const category = reader.short();
//     if (meta.isv20){
//         const unusableById = reader.uint();
//         const unusableBy = offsetMap.unusableByV20[unusableById];
//     } else {
//         const unusableById = reader.uint();
//         const unusableBy = offsetMap.unusableBy[unusableById];
//     }
//     const equippedAppearanceId = reader.short();
//     const equippedAppearance = offsetMap.animationEe[equippedAppearanceId];
//   const minimumLevel = reader.short();
//   const minimumStrength = reader.short();
//   if (meta.hasKitIds) {
//     const minimumStrengthBonus = reader.byte();
//     const unusableBy1Id = reader.byte();
//     const minimumIntelligence = reader.byte();
//     const unusableBy2Id = reader.byte();
//     const minimumDexterity = reader.byte();
//     const unusableBy3Id = reader.byte();
//     const minimumWisdom = reader.byte();
//     const unusableBy4Id = reader.byte();
//     const minimumConstitution = reader.byte();
//     if (meta.hasProftypeIds) {
//         const weaponProficiency = reader.byte(); // "PROFTYPE.IDS"
//     } else {
//         const weaponProficiency = reader.byte(); // "STATS.IDS"
//     }
//   } else {
//     const minimumStrengthBonus = reader.short();
//     const minimumIntelligence = reader.short();
//     const minimumDexterity = reader.short();
//     const minimumWisdom = reader.short();
//     const minimumConstitution = reader.short();
//   }
//   const minimumCharisma = reader.short();
//   const price = reader.uint();
//   const maximumInStack = reader.short();
//   const icon = reader.string(8);
//   const loreToIdentify = reader.short();
//   const groundIcon = reader.string(8);
//   const weight = reader.uint();
//   const generalDescriptionRef = reader.uint();
//   const identifiedDescriptionRef = reader.uint();
//     const descriptionImage = reader.string(8);
//   const enchantment = reader.uint();
//   const abilitiesOffset = reader.uint();
//   const abilitiesCount = reader.short();
//   const globalOffset = reader.uint();
//   const globalIndex = reader.short();
//   const globalCount = reader.short();
//   const globalEffectsCount = reader.short();

//   const abilities: ItemAbility[] = [];
//   let off = abilitiesOffset;
//   for (let i = 0; i < abilitiesCount; i++) {
//     const ability = readAbility(buffer, off, meta);
//     abilities.push(ability);
//     off += 56;
//   }

//   const effects: ItemEffect[] = [];
//   off = globalOffset + 1 * globalIndex;
//   for (let i = 0; i < globalCount; i++) {
//     const effect = readEffect(buffer, off, meta);
//     effects.push(effect);
//     off += 8 + ;
//   }
// }

// const readItemV11 = (reader: BufferReader, meta: ItemMeta): Item => {
//     /* eslint-disable @stylistic/no-multi-spaces */
//     const generalNameRef    = reader.uint();
//     const identifiedNameRef = reader.uint();
//     /* eslint-enable */

//     if (meta.isv11 || (meta.isv10 && meta.isPstee)) {
//       const dropSound = reader.string(8);
//       if (meta.isPstee) {
//           const flagsId = reader.uint();
//           const flags = offsetMap.flagsPstee[flagsId]
//           const category = reader.short();
//       } else {
//           const flagsId = reader.uint();
//           const flags = offsetMap.flagsV11[flagsId]
//           const category = reader.short();
//       }
//       const unusableById = reader.uint();
//       const unusableBy = offsetMap.unusableByV11[unusableById];
//       const equippedAppearanceId = reader.short();
//       const equippedAppearance = offsetMap.animationEe[equippedAppearanceId];
//     } else {
//       const usedUpItem = reader.string(8);
//       const flags = reader.uint();
//       const category = reader.short();
//       if (meta.isv20){
//           const unusableById = reader.uint();
//           const unusableBy = offsetMap.unusableByV20[unusableById];
//       } else {
//           const unusableById = reader.uint();
//           const unusableBy = offsetMap.unusableBy[unusableById];
//       }
//       const equippedAppearanceId = reader.short();
//       const equippedAppearance = offsetMap.animationEe[equippedAppearanceId];
//     }
//     const minimumLevel = reader.short();
//     const minimumStrength = reader.short();
//     if (meta.hasKitIds) {
//       const minimumStrengthBonus = reader.byte();
//       if (meta.isv20) {
//           // updateKitUsability(KIT_USE_1_V2_ARRAY, 24, 8, true); // Meh...
//       }
//       const unusableBy1Id = reader.byte();
//       const minimumIntelligence = reader.byte();
//       const unusableBy2Id = reader.byte();
//       const minimumDexterity = reader.byte();
//       const unusableBy3Id = reader.byte();
//       const minimumWisdom = reader.byte();
//       const unusableBy4Id = reader.byte();
//       const minimumConstitution = reader.byte();
//       if (meta.hasProftypeIds) {
//           const weaponProficiency = reader.byte(); // "PROFTYPE.IDS"
//       } else {
//           const weaponProficiency = reader.byte(); // "STATS.IDS"
//       }
//     } else {
//       const minimumStrengthBonus = reader.short();
//       const minimumIntelligence = reader.short();
//       const minimumDexterity = reader.short();
//       const minimumWisdom = reader.short();
//       const minimumConstitution = reader.short();
//     }
//     const minimumCharisma = reader.short();
//     const price = reader.uint();
//     const maximumInStack = reader.short();
//     const icon = reader.string(8);
//     const loreToIdentify = reader.short();
//     const groundIcon = reader.string(8);
//     const weight = reader.uint();
//     const generalDescriptionRef = reader.uint();
//     const identifiedDescriptionRef = reader.uint();
//     if (meta.isv11 || (meta.isv10 && meta.isPstee)) {
//       const pickUpSound = reader.string(8);
//     } else {
//       const descriptionImage = reader.string(8);
//     }
//     const enchantment = reader.uint();
//     const abilitiesOffset = reader.uint();
//     const abilitiesCount = reader.short();
//     const globalOffset = reader.uint();
//     const globalIndex = reader.short();
//     const globalCount = reader.short();
//     const globalEffectsCount = reader.short();

//     if (meta.isv11) {
//       const dialogue = reader.string(8);
//       const speakerName = reader.string(4);
//       const weaponColor = reader.short();
//       // addField(new Unknown(buffer, 128, 26));
//     } else if (meta.isv20) {
//       // addField(new Unknown(buffer, 114, 16));
//     }

//     const abilities: ItemAbility[] = [];
//     let off = abilitiesOffset;
//     for (let i = 0; i < abilitiesCount; i++) {
//       const ability = readAbility(buffer, off, meta);
//       abilities.push(ability);
//       off += 56;
//     }

//     const effects: ItemEffect[] = [];
//     off = globalOffset + 1 * globalIndex;
//     for (let i = 0; i < globalCount; i++) {
//       const effect = readEffect(buffer, off, meta);
//       effects.push(effect);
//       off += 8 + ;
//     }
//   }

//   const readItemV20 = (reader: BufferReader, meta: ItemMeta): Item => {
//     /* eslint-disable @stylistic/no-multi-spaces */
//     const generalNameRef    = reader.uint();
//     const identifiedNameRef = reader.uint();
//     /* eslint-enable */

//     if (meta.isv11 || (meta.isv10 && meta.isPstee)) {
//       const dropSound = reader.string(8);
//       if (meta.isPstee) {
//           const flagsId = reader.uint();
//           const flags = offsetMap.flagsPstee[flagsId]
//           const category = reader.short();
//       } else {
//           const flagsId = reader.uint();
//           const flags = offsetMap.flagsV11[flagsId]
//           const category = reader.short();
//       }
//       const unusableById = reader.uint();
//       const unusableBy = offsetMap.unusableByV11[unusableById];
//       const equippedAppearanceId = reader.short();
//       const equippedAppearance = offsetMap.animationEe[equippedAppearanceId];
//     } else {
//       const usedUpItem = reader.string(8);
//       const flags = reader.uint();
//       const category = reader.short();
//       if (meta.isv20){
//           const unusableById = reader.uint();
//           const unusableBy = offsetMap.unusableByV20[unusableById];
//       } else {
//           const unusableById = reader.uint();
//           const unusableBy = offsetMap.unusableBy[unusableById];
//       }
//       const equippedAppearanceId = reader.short();
//       const equippedAppearance = offsetMap.animationEe[equippedAppearanceId];
//     }
//     const minimumLevel = reader.short();
//     const minimumStrength = reader.short();
//     if (meta.hasKitIds) {
//       const minimumStrengthBonus = reader.byte();
//       if (meta.isv20) {
//           // updateKitUsability(KIT_USE_1_V2_ARRAY, 24, 8, true); // Meh...
//       }
//       const unusableBy1Id = reader.byte();
//       const minimumIntelligence = reader.byte();
//       const unusableBy2Id = reader.byte();
//       const minimumDexterity = reader.byte();
//       const unusableBy3Id = reader.byte();
//       const minimumWisdom = reader.byte();
//       const unusableBy4Id = reader.byte();
//       const minimumConstitution = reader.byte();
//       if (meta.hasProftypeIds) {
//           const weaponProficiency = reader.byte(); // "PROFTYPE.IDS"
//       } else {
//           const weaponProficiency = reader.byte(); // "STATS.IDS"
//       }
//     } else {
//       const minimumStrengthBonus = reader.short();
//       const minimumIntelligence = reader.short();
//       const minimumDexterity = reader.short();
//       const minimumWisdom = reader.short();
//       const minimumConstitution = reader.short();
//     }
//     const minimumCharisma = reader.short();
//     const price = reader.uint();
//     const maximumInStack = reader.short();
//     const icon = reader.string(8);
//     const loreToIdentify = reader.short();
//     const groundIcon = reader.string(8);
//     const weight = reader.uint();
//     const generalDescriptionRef = reader.uint();
//     const identifiedDescriptionRef = reader.uint();
//     if (meta.isv11 || (meta.isv10 && meta.isPstee)) {
//       const pickUpSound = reader.string(8);
//     } else {
//       const descriptionImage = reader.string(8);
//     }
//     const enchantment = reader.uint();
//     const abilitiesOffset = reader.uint();
//     const abilitiesCount = reader.short();
//     const globalOffset = reader.uint();
//     const globalIndex = reader.short();
//     const globalCount = reader.short();
//     const globalEffectsCount = reader.short();

//     if (meta.isv11) {
//       const dialogue = reader.string(8);
//       const speakerName = reader.string(4);
//       const weaponColor = reader.short();
//       // addField(new Unknown(buffer, 128, 26));
//     } else if (meta.isv20) {
//       // addField(new Unknown(buffer, 114, 16));
//     }

//     const abilities: ItemAbility[] = [];
//     let off = abilitiesOffset;
//     for (let i = 0; i < abilitiesCount; i++) {
//       const ability = readAbility(buffer, off, meta);
//       abilities.push(ability);
//       off += 56;
//     }

//     const effects: ItemEffect[] = [];
//     off = globalOffset + 1 * globalIndex;
//     for (let i = 0; i < globalCount; i++) {
//       const effect = readEffect(buffer, off, meta);
//       effects.push(effect);
//       off += 8 + ;
//     }
//   }
// const readItemBuffer = (buffer: Buffer, resourceName: string, gameName: GameName): Item => {
//   const reader = createReader(buffer);

//   const header: ItemHeader = readHeader(reader);

//   const useV10 = meta.isv10;
//   const useV11 = meta.isv11 || (meta.isv10 && meta.isPstee);
//   const useV20 = meta.isv20;

//   if (useV10) return readItemV10(reader, meta);
//   if (useV11) return readItemV11(reader, meta);
//   if (useV20) return readItemV20(reader, meta);
//   throw new Error(`This error never happend`);

// };

// export default readItemBuffer;
