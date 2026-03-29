import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../../types.js';
import type { Signature, Versions } from '../../types.js';
import type { ItemSlotsBg1Bg2BgeeV10, ItemSlotsPsteeV10 } from '../../v10.types/7.itemSlot.js';

type ItemSlotsV10 = ItemSlotsBg1Bg2BgeeV10 | ItemSlotsPsteeV10;

const parseBg1Bg2BgeeV10 = (reader: BufferReader): ItemSlotsBg1Bg2BgeeV10 => {
  const helmet = reader.ushort();
  const armor = reader.ushort();
  const shield = reader.ushort();
  const gloves = reader.ushort();
  const leftRing = reader.ushort();
  const rightRing = reader.ushort();
  const amulet = reader.ushort();
  const belt = reader.ushort();
  const boots = reader.ushort();
  const weapon1 = reader.ushort();
  const weapon2 = reader.ushort();
  const weapon3 = reader.ushort();
  const weapon4 = reader.ushort();
  const quiver1 = reader.ushort();
  const quiver2 = reader.ushort();
  const quiver3 = reader.ushort();
  const quiver4 = reader.ushort();
  const cloak = reader.ushort();
  const quickItem1 = reader.ushort();
  const quickItem2 = reader.ushort();
  const quickItem3 = reader.ushort();
  const inventoryItem1 = reader.ushort();
  const inventoryItem2 = reader.ushort();
  const inventoryItem3 = reader.ushort();
  const inventoryItem4 = reader.ushort();
  const inventoryItem5 = reader.ushort();
  const inventoryItem6 = reader.ushort();
  const inventoryItem7 = reader.ushort();
  const inventoryItem8 = reader.ushort();
  const inventoryItem9 = reader.ushort();
  const inventoryItem10 = reader.ushort();
  const inventoryItem11 = reader.ushort();
  const inventoryItem12 = reader.ushort();
  const inventoryItem13 = reader.ushort();
  const inventoryItem14 = reader.ushort();
  const inventoryItem15 = reader.ushort();
  const inventoryItem16 = reader.ushort();
  const magicweapon = reader.ushort();
  const selectedweapon = reader.ushort();
  const selectedweaponability = reader.ushort();

  return {
    helmet,
    armor,
    shield,
    gloves,
    leftRing,
    rightRing,
    amulet,
    belt,
    boots,
    weapon1,
    weapon2,
    weapon3,
    weapon4,
    quiver1,
    quiver2,
    quiver3,
    quiver4,
    cloak,
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
    magicweapon,
    selectedweapon,
    selectedweaponability,
  };
};

const parsePsteeV10 = (reader: BufferReader): ItemSlotsPsteeV10 => {
  const leftEarringOrLensOrHelmet = reader.ushort(); // TODO [snow]: to enum
  const chest = reader.ushort();
  const rightLowerTattoo = reader.ushort();
  const hand = reader.ushort();
  const rightRing = reader.ushort();
  const leftRing = reader.ushort();
  const rightEarringOrEyeball = reader.ushort();
  const leftTattoo = reader.ushort();
  const wrist = reader.ushort();
  const weapon1 = reader.ushort();
  const weapon2 = reader.ushort();
  const weapon3 = reader.ushort();
  const weapon4 = reader.ushort();
  const quiver1 = reader.ushort();
  const quiver2 = reader.ushort();
  const quiver3 = reader.ushort();
  const quiver4 = reader.ushort();
  const rightUpperRattoo = reader.ushort();
  const quickItem1 = reader.ushort();
  const quickItem2 = reader.ushort();
  const quickItem3 = reader.ushort();
  const inventoryItem1 = reader.ushort();
  const inventoryItem2 = reader.ushort();
  const inventoryItem3 = reader.ushort();
  const inventoryItem4 = reader.ushort();
  const inventoryItem5 = reader.ushort();
  const inventoryItem6 = reader.ushort();
  const inventoryItem7 = reader.ushort();
  const inventoryItem8 = reader.ushort();
  const inventoryItem9 = reader.ushort();
  const inventoryItem10 = reader.ushort();
  const inventoryItem11 = reader.ushort();
  const inventoryItem12 = reader.ushort();
  const inventoryItem13 = reader.ushort();
  const inventoryItem14 = reader.ushort();
  const inventoryItem15 = reader.ushort();
  const inventoryItem16 = reader.ushort();
  const magicWeapon = reader.ushort();
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

const parseItemSlotsV10 = (reader: BufferReader, meta: Meta<Signature, Versions>): ItemSlotsV10 => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  // const itemSlotsSize = 80; // just to know

  if (meta.isBg1 || meta.isBg2 || meta.isBg2ee) {
    return parseBg1Bg2BgeeV10(reader);
  }
  else if (meta.isPstee) {
    return parsePsteeV10(reader);
  }
  else {
    throw new Error(`Unknown game parsing creature '${meta.resourceName}' item slots`);
  }
};

export default parseItemSlotsV10;
