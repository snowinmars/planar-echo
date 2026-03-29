import { extend } from '@/pipes/offsetMap.js';

/* createGenerator().register().enum('targetTypeV10',
 *   ['none','self','projectile target','party','everyone','everyone except party','caster group','target group','everyone except self','original caster',]
 * ).write()
 */
const targetTypeV10 = {
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
type TargetTypeV10 = typeof targetTypeV10[keyof typeof targetTypeV10];

/* createGenerator().register().enum('timingModeV10', {
 *  0: ['instant/limited','instant/permanent','instant/while equipped','delay/limited','delay/permanent','delay/while equipped','limited after duration','permanent after duration','equipped after duration','instant/permanent (after death)','instant/limited'],
 *  4096: ['absolute duration']
 * }).write()
 */
const timingModeV10 = {
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
type TimingModeV10 = typeof timingModeV10[keyof typeof timingModeV10];

/* createGenerator().register().enum('dispelOrResistanceV10',
 *   ['nonmagical','can be dispelled/affected by resistance','cannot be dispelled/ignores resistance','can be dispelled/ignores resistance',]
 * ).write()
 */
const dispelOrResistanceV10 = {
  0: 'nonmagical',
  1: 'can be dispelled/affected by resistance',
  2: 'cannot be dispelled/ignores resistance',
  3: 'can be dispelled/ignores resistance',
} as const;
type DispelOrResistanceV10 = typeof dispelOrResistanceV10[keyof typeof dispelOrResistanceV10];

/* createGenerator().register().flags('savingThrowTypeV10',{
 *   byte1:['spells','breath','paralyze/poison/death','wands','petrify/polymorph'],
 *   byte2:[null,null,'ignore primary target (ee only)','ignore secondary target (ee only)'],
 *   byte3:null,
 *   byte4:['bypass mirror image (ee/tobex only)','ignore difficulty (ee only)/limit effect stacking (tobex only)','tobex internal (don’t use)']
 * }).write();
 */
const savingThrowTypeV10 = {
// byte1
  0x1: 'spells',
  0x2: 'breath',
  0x4: 'paralyze/poison/death',
  0x8: 'wands',
  0x10: 'petrify/polymorph',
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused

  // byte2
  // 0x100: unused
  // 0x200: unused
  0x400: 'ignore primary target (ee only)',
  0x800: 'ignore secondary target (ee only)',
  // 0x100: unused
  // 0x200: unused
  // 0x400: unused
  // 0x800: unused

  // byte3
  // unused

  // byte4
  0x1000000: 'bypass mirror image (ee/tobex only)',
  0x2000000: 'ignore difficulty (ee only)/limit effect stacking (tobex only)',
  0x4000000: 'tobex internal (don’t use)',
// 0x1000000: unused
// 0x2000000: unused
// 0x4000000: unused
// 0x8000000: unused
// 0x10000000: unused
} as const;
type SavingThrowTypeV10 = typeof savingThrowTypeV10[keyof typeof savingThrowTypeV10];

export const offsetMap = {
  targetType: extend(targetTypeV10),
  timingMode: extend(timingModeV10),
  resistance: extend(dispelOrResistanceV10),
  savingThrowType: extend(savingThrowTypeV10),
};

export type FeatureBlockV10 = Readonly<{
  opcodeNumber: number;
  targetType: TargetTypeV10;
  power: number;
  parameter1: number;
  parameter2: number;
  timingMode: TimingModeV10;
  dispelOrResistance: DispelOrResistanceV10;
  duration: number;
  probability1: number;
  probability2: number;
  resource: string;
  diceThrownOrMaximumLevel: number;
  diceSidesOrMinimumLevel: number;
  savingThrowType: SavingThrowTypeV10[];
  savingThrowBonus: number;
  stackingId: number;
}>;
