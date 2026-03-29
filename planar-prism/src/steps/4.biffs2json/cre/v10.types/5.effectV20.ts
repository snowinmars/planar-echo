import { extend } from '@/pipes/offsetMap.js';

/* createGenerator().register().enum('targetTypeV20',
 *   ['none','self','projectile target','party','everyone','everyone except party','caster group','target group','everyone except self','original caster',]
 * ).write()
 */
const targetTypeV20 = {
  0: 'none',
  1: 'self',
  2: 'projectile target',
  3: 'party',
  4: 'everyone',
  5: 'everyone except party',
  6: 'caster group',
  7: 'target group',
  8: 'everyone except self',
  9: 'original caster',
} as const;
type TargetTypeV20 = typeof targetTypeV20[keyof typeof targetTypeV20];

/* createGenerator().register().enum('timingModeV20', {
 *   0: ['instant/limited','instant/permanent','instant/while equipped','delay/limited','delay/permanent','delay/while equipped','limited after duration','permanent after duration','equipped after duration','instant/permanent (after death)','instant/limited',],
 *   4096: ['absolute duration'],
 * }).write()
 */
const timingModeV20 = {
  0: 'instant/limited',
  1: 'instant/permanent',
  2: 'instant/while equipped',
  3: 'delay/limited',
  4: 'delay/permanent',
  5: 'delay/while equipped',
  6: 'limited after duration',
  7: 'permanent after duration',
  8: 'equipped after duration',
  9: 'instant/permanent (after death)',
  10: 'instant/limited',
  4096: 'absolute duration',
} as const;
type TimingModeV20 = typeof timingModeV20[keyof typeof timingModeV20];

/* createGenerator().register().flags('savingThrowTypeV20', {
 *   byte1: ['spells','breath','paralyze/poison/death','wands','petrify/polymorph','spells (ee only)','breath (ee only)','paralyze/poison/death (ee only)'],
 *   byte2: ['wands (ee only)','petrify/polymorph (ee only)','ignore primary target (ee only)','ignore secondary target (ee only)'],
 *   byte3: null,
 *   byte4: ['bypass mirror image (ee/tobex only)','ignore difficulty (ee only)/limit effect stacking (tobex only)','tobex internal (don’t use)'],
 * }).write();
 */
const savingThrowTypeV20 = {
  // byte1
  0x1: 'spells',
  0x2: 'breath',
  0x4: 'paralyze/poison/death',
  0x8: 'wands',
  0x10: 'petrify/polymorph',
  0x20: 'spells (ee only)',
  0x40: 'breath (ee only)',
  0x80: 'paralyze/poison/death (ee only)',

  // byte2
  0x100: 'wands (ee only)',
  0x200: 'petrify/polymorph (ee only)',
  0x400: 'ignore primary target (ee only)',
  0x800: 'ignore secondary target (ee only)',
  // 0x1000: unused
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused

  // byte3
  // unused

  // byte4
  0x1000000: 'bypass mirror image (ee/tobex only)',
  0x2000000: 'ignore difficulty (ee only)/limit effect stacking (tobex only)',
  0x4000000: 'tobex internal (don’t use)',
  // 0x8000000: unused
  // 0x10000000: unused
  // 0x20000000: unused
  // 0x40000000: unused
  // 0x80000000: unused
} as const;
type SavingThrowTypeV20 = typeof savingThrowTypeV20[keyof typeof savingThrowTypeV20];

/* createGenerator().register().flags('dispelOrResistanceV20', {
 *   byte1: ['dispel','bypass resistance','Bypasses opcodes 199, 200, 201, 259','self-targeted'],
 *   byte2: null,
 *   byte3: null,
 *   byte4: [null,null,null,null,null,null,null,'effect applied by item'],
 * }).write();
 */
const dispelOrResistanceV20 = {
  // byte1
  0x1: 'dispel',
  0x2: 'bypass resistance',
  0x4: 'Bypasses opcodes 199, 200, 201, 259',
  0x8: 'self-targeted',
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused

  // byte2
  // unused

  // byte3
  // unused

  // byte4
  // 0x1000000: unused
  // 0x2000000: unused
  // 0x4000000: unused
  // 0x8000000: unused
  // 0x10000000: unused
  // 0x20000000: unused
  // 0x40000000: unused
  0x80000000: 'effect applied by item',
} as const;
type DispelOrResistanceV20 = typeof dispelOrResistanceV20[keyof typeof dispelOrResistanceV20];

/* createGenerator().register().enum('parentResourceTypeV20',
 *   ['none','spell','item']
 * ).write()
 */
const parentResourceTypeV20 = {
  0: 'none',
  1: 'spell',
  2: 'item',
} as const;
type ParentResourceTypeV20 = typeof parentResourceTypeV20[keyof typeof parentResourceTypeV20];

/* createGenerator().register().flags('parentResourceFlagsV20', {
 *   byte1: null,
 *   byte2: ['hostile','no los required','allow spotting','outdoors only','non-magical ability','ignore wild surge','non-combat ability',],
 * }).write();
 */
const parentResourceFlagsV20 = {
  // byte1
  // unused

  // byte2
  0x100: 'hostile',
  0x200: 'no los required',
  0x400: 'allow spotting',
  0x800: 'outdoors only',
  0x1000: 'non-magical ability',
  0x2000: 'ignore wild surge',
  0x4000: 'non-combat ability',
  // 0x8000: unused
} as const;
type ParentResourceFlagsV20 = typeof parentResourceFlagsV20[keyof typeof parentResourceFlagsV20];

export const offsetMap = {
  targetType: extend(targetTypeV20),
  timingMode: extend(timingModeV20),
  dispelOrResistance: extend(dispelOrResistanceV20),
  savingThrowType: extend(savingThrowTypeV20),
  parentResourceType: extend(parentResourceTypeV20),
  parentResourceFlags: extend(parentResourceFlagsV20),
};

export type EffectV20 = Readonly<{
  signature: string;
  version: string;
  opCode: number;
  targetType: TargetTypeV20;
  power: number;
  parameter1: number;
  parameter2: number;
  timingMode: TimingModeV20;
  duration: number;
  probability1: number;
  probability2: number;
  resourceRef: string;
  diceThrown: number;
  diceSides: number;
  savingThrowType: SavingThrowTypeV20[];
  saveBonus: number;
  specialEeGames: number;
  primaryTypeSchool: number;
  parentResourceLowestAffectedLevel: number;
  parentResourceHighestAffectedLevel: number;
  dispelOrResistance: DispelOrResistanceV20[];
  parameter3: number;
  parameter4: number;
  parameter5: number;
  timeApplied: number;
  resource2Ref: string;
  resource3Ref: string;
  casterX: number;
  casterY: number;
  targetX: number;
  targetY: number;
  parentResourceType: ParentResourceTypeV20;
  parentResource: string;
  parentResourceFlags: ParentResourceFlagsV20[];
  projectile: number;
  parentResourceSlot: number;
  variableName: string;
  casterLevel: number;
  firstApply: number;
  secondaryType: number;
}>;
