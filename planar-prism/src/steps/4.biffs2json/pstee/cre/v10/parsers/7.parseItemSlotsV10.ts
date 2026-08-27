import { nothing, type Maybe } from '@planar/shared';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawCreItemSlotsV10 } from './7.parseItemSlotsV10.types.js';

export const parseItemSlotsV10 = (reader: BufferReader): RawCreItemSlotsV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const maybeShort = (): Maybe<number> => {
    const v = reader.short();
    return v === -1 ? nothing() : v;
  };

  // const itemSlotsSize = 80; // just to know
  const leftEarringOrLensOrHelmet = maybeShort();
  const chest = maybeShort();
  const rightLowerTattoo = maybeShort();
  const hand = maybeShort();
  const rightRing = maybeShort();
  const leftRing = maybeShort();
  const rightEarringOrEyeball = maybeShort();
  const leftTattoo = maybeShort();
  const wrist = maybeShort();
  const weapon1 = maybeShort();
  const weapon2 = maybeShort();
  const weapon3 = maybeShort();
  const weapon4 = maybeShort();
  const quiver1 = maybeShort();
  const quiver2 = maybeShort();
  const quiver3 = maybeShort();
  const quiver4 = maybeShort();
  const rightUpperRattoo = maybeShort();
  const quickItem1 = maybeShort();
  const quickItem2 = maybeShort();
  const quickItem3 = maybeShort();
  const inventoryItem1 = maybeShort();
  const inventoryItem2 = maybeShort();
  const inventoryItem3 = maybeShort();
  const inventoryItem4 = maybeShort();
  const inventoryItem5 = maybeShort();
  const inventoryItem6 = maybeShort();
  const inventoryItem7 = maybeShort();
  const inventoryItem8 = maybeShort();
  const inventoryItem9 = maybeShort();
  const inventoryItem10 = maybeShort();
  const inventoryItem11 = maybeShort();
  const inventoryItem12 = maybeShort();
  const inventoryItem13 = maybeShort();
  const inventoryItem14 = maybeShort();
  const inventoryItem15 = maybeShort();
  const inventoryItem16 = maybeShort();
  const magicWeapon = maybeShort();
  const selectedWeapon = reader.ushort();
  const selectedWeaponAbility = reader.ushort();

  return {
    leftEarringOrLensOrHelmet,
    chest,
    rightLowerTattoo,
    hand,
    rightRing,
    leftRing,
    rightEarringOrEyeball,
    leftTattoo,
    wrist,
    weapon1,
    weapon2,
    weapon3,
    weapon4,
    quiver1,
    quiver2,
    quiver3,
    quiver4,
    rightUpperRattoo,
    quickItem1,
    quickItem2,
    quickItem3,
    inventoryItem1,
    inventoryItem2,
    inventoryItem3,
    inventoryItem4,
    inventoryItem5,
    inventoryItem6,
    inventoryItem7,
    inventoryItem8,
    inventoryItem9,
    inventoryItem10,
    inventoryItem11,
    inventoryItem12,
    inventoryItem13,
    inventoryItem14,
    inventoryItem15,
    inventoryItem16,
    magicWeapon,
    selectedWeapon,
    selectedWeaponAbility,
  };
};
