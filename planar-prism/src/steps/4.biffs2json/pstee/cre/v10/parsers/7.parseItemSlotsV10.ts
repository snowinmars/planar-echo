import type { BufferReader } from '@/shared/bufferReader.js';
import type { ItemSlotsV10 } from './7.parseItemSlotsV10.types.js';

export const parseItemSlotsV10 = (reader: BufferReader): ItemSlotsV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  // const itemSlotsSize = 80; // just to know
  const leftEarringOrLensOrHelmet = reader.ushort(); // TODO [snow]: to enum
  const chest = reader.ushort(true);
  const rightLowerTattoo = reader.ushort(true);
  const hand = reader.ushort(true);
  const rightRing = reader.ushort(true);
  const leftRing = reader.ushort(true);
  const rightEarringOrEyeball = reader.ushort(true);
  const leftTattoo = reader.ushort(true);
  const wrist = reader.ushort(true);
  const weapon1 = reader.ushort(true);
  const weapon2 = reader.ushort(true);
  const weapon3 = reader.ushort(true);
  const weapon4 = reader.ushort(true);
  const quiver1 = reader.ushort(true);
  const quiver2 = reader.ushort(true);
  const quiver3 = reader.ushort(true);
  const quiver4 = reader.ushort(true);
  const rightUpperRattoo = reader.ushort(true);
  const quickItem1 = reader.ushort(true);
  const quickItem2 = reader.ushort(true);
  const quickItem3 = reader.ushort(true);
  const inventoryItem1 = reader.ushort(true);
  const inventoryItem2 = reader.ushort(true);
  const inventoryItem3 = reader.ushort(true);
  const inventoryItem4 = reader.ushort(true);
  const inventoryItem5 = reader.ushort(true);
  const inventoryItem6 = reader.ushort(true);
  const inventoryItem7 = reader.ushort(true);
  const inventoryItem8 = reader.ushort(true);
  const inventoryItem9 = reader.ushort(true);
  const inventoryItem10 = reader.ushort(true);
  const inventoryItem11 = reader.ushort(true);
  const inventoryItem12 = reader.ushort(true);
  const inventoryItem13 = reader.ushort(true);
  const inventoryItem14 = reader.ushort(true);
  const inventoryItem15 = reader.ushort(true);
  const inventoryItem16 = reader.ushort(true);
  const magicWeapon = reader.ushort(true);
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
