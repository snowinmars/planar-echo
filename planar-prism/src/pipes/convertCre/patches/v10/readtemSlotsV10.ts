import type { BufferReader } from '../../../../pipes/readers.js';
import type { CreatureMeta } from '../readCreatureBufferTypes.js';
import type { ItemSlotsBg1Bg2BgeeV10, ItemSlotsPsteeV10 } from './readtemSlotsTypesV10.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import type { CreatureHeaderV10 } from './readHeaderTypesV10.js';

type ItemSlotsV10 = ItemSlotsBg1Bg2BgeeV10 | ItemSlotsPsteeV10;

const readitemSlotBg1Bg2BgeeV10 = (reader: BufferReader, meta: CreatureMeta): ItemSlotsBg1Bg2BgeeV10 => {
  const tmp: PartialWriteable<ItemSlotsBg1Bg2BgeeV10> = {};

  tmp.helmet = reader.ushort();
  tmp.armor = reader.ushort();
  tmp.shield = reader.ushort();
  tmp.gloves = reader.ushort();
  tmp.leftRing = reader.ushort();
  tmp.rightRing = reader.ushort();
  tmp.amulet = reader.ushort();
  tmp.belt = reader.ushort();
  tmp.boots = reader.ushort();
  tmp.weapon1 = reader.ushort();
  tmp.weapon2 = reader.ushort();
  tmp.weapon3 = reader.ushort();
  tmp.weapon4 = reader.ushort();
  tmp.quiver1 = reader.ushort();
  tmp.quiver2 = reader.ushort();
  tmp.quiver3 = reader.ushort();
  tmp.quiver4 = reader.ushort();
  tmp.cloak = reader.ushort();
  tmp.quickItem1 = reader.ushort();
  tmp.quickItem2 = reader.ushort();
  tmp.quickItem3 = reader.ushort();
  tmp.inventoryItem1 = reader.ushort();
  tmp.inventoryItem2 = reader.ushort();
  tmp.inventoryItem3 = reader.ushort();
  tmp.inventoryItem4 = reader.ushort();
  tmp.inventoryItem5 = reader.ushort();
  tmp.inventoryItem6 = reader.ushort();
  tmp.inventoryItem7 = reader.ushort();
  tmp.inventoryItem8 = reader.ushort();
  tmp.inventoryItem9 = reader.ushort();
  tmp.inventoryItem10 = reader.ushort();
  tmp.inventoryItem11 = reader.ushort();
  tmp.inventoryItem12 = reader.ushort();
  tmp.inventoryItem13 = reader.ushort();
  tmp.inventoryItem14 = reader.ushort();
  tmp.inventoryItem15 = reader.ushort();
  tmp.inventoryItem16 = reader.ushort();
  tmp.magicweapon = reader.ushort();
  tmp.selectedweapon = reader.ushort();
  tmp.selectedweaponability = reader.ushort();

  return {
    helmet: tmp.helmet,
    armor: tmp.armor,
    shield: tmp.shield,
    gloves: tmp.gloves,
    leftRing: tmp.leftRing,
    rightRing: tmp.rightRing,
    amulet: tmp.amulet,
    belt: tmp.belt,
    boots: tmp.boots,
    weapon1: tmp.weapon1,
    weapon2: tmp.weapon2,
    weapon3: tmp.weapon3,
    weapon4: tmp.weapon4,
    quiver1: tmp.quiver1,
    quiver2: tmp.quiver2,
    quiver3: tmp.quiver3,
    quiver4: tmp.quiver4,
    cloak: tmp.cloak,
    quickItem1: tmp.quickItem1,
    quickItem2: tmp.quickItem2,
    quickItem3: tmp.quickItem3,
    inventoryItem1: tmp.inventoryItem1,
    inventoryItem2: tmp.inventoryItem2,
    inventoryItem3: tmp.inventoryItem3,
    inventoryItem4: tmp.inventoryItem4,
    inventoryItem5: tmp.inventoryItem5,
    inventoryItem6: tmp.inventoryItem6,
    inventoryItem7: tmp.inventoryItem7,
    inventoryItem8: tmp.inventoryItem8,
    inventoryItem9: tmp.inventoryItem9,
    inventoryItem10: tmp.inventoryItem10,
    inventoryItem11: tmp.inventoryItem11,
    inventoryItem12: tmp.inventoryItem12,
    inventoryItem13: tmp.inventoryItem13,
    inventoryItem14: tmp.inventoryItem14,
    inventoryItem15: tmp.inventoryItem15,
    inventoryItem16: tmp.inventoryItem16,
    magicweapon: tmp.magicweapon,
    selectedweapon: tmp.selectedweapon,
    selectedweaponability: tmp.selectedweaponability,
  };
};

const readitemSlotPsteeV10 = (reader: BufferReader, meta: CreatureMeta): ItemSlotsPsteeV10 => {
  const tmp: PartialWriteable<ItemSlotsPsteeV10> = {};

  tmp.leftEarringOrLensOrHelmet = reader.ushort(); // TODO [snow]: to enum
  tmp.chest = reader.ushort();
  tmp.rightLowerTattoo = reader.ushort();
  tmp.hand = reader.ushort();
  tmp.rightRing = reader.ushort();
  tmp.leftRing = reader.ushort();
  tmp.rightEarringOrEyeball = reader.ushort();
  tmp.leftTattoo = reader.ushort();
  tmp.wrist = reader.ushort();
  tmp.weapon1 = reader.ushort();
  tmp.weapon2 = reader.ushort();
  tmp.weapon3 = reader.ushort();
  tmp.weapon4 = reader.ushort();
  tmp.quiver1 = reader.ushort();
  tmp.quiver2 = reader.ushort();
  tmp.quiver3 = reader.ushort();
  tmp.quiver4 = reader.ushort();
  tmp.rightUpperRattoo = reader.ushort();
  tmp.quickItem1 = reader.ushort();
  tmp.quickItem2 = reader.ushort();
  tmp.quickItem3 = reader.ushort();
  tmp.inventoryItem1 = reader.ushort();
  tmp.inventoryItem2 = reader.ushort();
  tmp.inventoryItem3 = reader.ushort();
  tmp.inventoryItem4 = reader.ushort();
  tmp.inventoryItem5 = reader.ushort();
  tmp.inventoryItem6 = reader.ushort();
  tmp.inventoryItem7 = reader.ushort();
  tmp.inventoryItem8 = reader.ushort();
  tmp.inventoryItem9 = reader.ushort();
  tmp.inventoryItem10 = reader.ushort();
  tmp.inventoryItem11 = reader.ushort();
  tmp.inventoryItem12 = reader.ushort();
  tmp.inventoryItem13 = reader.ushort();
  tmp.inventoryItem14 = reader.ushort();
  tmp.inventoryItem15 = reader.ushort();
  tmp.inventoryItem16 = reader.ushort();
  tmp.magicWeapon = reader.ushort();
  tmp.selectedWeapon = reader.ushort();
  tmp.selectedWeaponAbility = reader.ushort();

  return {
    leftEarringOrLensOrHelmet: tmp.leftEarringOrLensOrHelmet,
    chest: tmp.chest,
    rightLowerTattoo: tmp.rightLowerTattoo,
    hand: tmp.hand,
    rightRing: tmp.rightRing,
    leftRing: tmp.leftRing,
    rightEarringOrEyeball: tmp.rightEarringOrEyeball,
    leftTattoo: tmp.leftTattoo,
    wrist: tmp.wrist,
    weapon1: tmp.weapon1,
    weapon2: tmp.weapon2,
    weapon3: tmp.weapon3,
    weapon4: tmp.weapon4,
    quiver1: tmp.quiver1,
    quiver2: tmp.quiver2,
    quiver3: tmp.quiver3,
    quiver4: tmp.quiver4,
    rightUpperRattoo: tmp.rightUpperRattoo,
    quickItem1: tmp.quickItem1,
    quickItem2: tmp.quickItem2,
    quickItem3: tmp.quickItem3,
    inventoryItem1: tmp.inventoryItem1,
    inventoryItem2: tmp.inventoryItem2,
    inventoryItem3: tmp.inventoryItem3,
    inventoryItem4: tmp.inventoryItem4,
    inventoryItem5: tmp.inventoryItem5,
    inventoryItem6: tmp.inventoryItem6,
    inventoryItem7: tmp.inventoryItem7,
    inventoryItem8: tmp.inventoryItem8,
    inventoryItem9: tmp.inventoryItem9,
    inventoryItem10: tmp.inventoryItem10,
    inventoryItem11: tmp.inventoryItem11,
    inventoryItem12: tmp.inventoryItem12,
    inventoryItem13: tmp.inventoryItem13,
    inventoryItem14: tmp.inventoryItem14,
    inventoryItem15: tmp.inventoryItem15,
    inventoryItem16: tmp.inventoryItem16,
    magicWeapon: tmp.magicWeapon,
    selectedWeapon: tmp.selectedWeapon,
    selectedWeaponAbility: tmp.selectedWeaponAbility,
  };
};

const readItemSlotsV10 = (reader: BufferReader, header: CreatureHeaderV10, meta: CreatureMeta): ItemSlotsV10 => {
  if (meta.isBg || meta.isBg2 || meta.isBg2ee) {
    return readitemSlotBg1Bg2BgeeV10(reader.fork(header.offsetToItemSlots), meta);
  }
  else if (meta.isPstee) {
    return readitemSlotPsteeV10(reader.fork(header.offsetToItemSlots), meta);
  }
  else {
    throw new Error(`Unknown game parsing creature '${meta.resourceName}' item slots`);
  }
};

export default readItemSlotsV10;
