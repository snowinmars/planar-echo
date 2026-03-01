import { extend } from '../../../../pipes/offsetMap.js';

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

const dispelOrResistanceV10 = {
  0: 'nonmagical',
  1: 'can be dispelled/affected by resistance',
  2: 'cannot be dispelled/ignores resistance',
  3: 'can be dispelled/ignores resistance',
} as const;
type DispelOrResistanceV10 = typeof dispelOrResistanceV10[keyof typeof dispelOrResistanceV10];

const savingThrowTypeV10 = {
  0x1: 'spells',
  0x2: 'breath',
  0x3: 'paralyze/poison/death',
  0x4: 'wands',
  0x5: 'petrify/polymorph',
  // 0x6: unknown
  // 0x7: unknown
  // 0x8: unknown
  // 0x9: unknown
  // 0x10: unknown
  0x11: 'ignore primary target (ee only)',
  0x12: 'ignore secondary target (ee only)',
  // 0x13: unknown
  // 0x14: unknown
  // 0x15: unknown
  // 0x16: unknown
  // 0x17: unknown
  // 0x18: unknown
  // 0x19: unknown
  // 0x20: unknown
  // 0x21: unknown
  // 0x22: unknown
  // 0x23: unknown
  // 0x24: unknown
  0x25: 'bypass mirror image (ee/tobex only)',
  0x26: 'ignore difficulty (ee only)/limit effect stacking (tobex only)',
  0x27: 'tobex internal (don’t use)',
} as const;
type SavingThrowTypeV10 = typeof savingThrowTypeV10[keyof typeof savingThrowTypeV10];

export const offsetMap = {
  targetType: extend(targetTypeV10),
  timingMode: extend(timingModeV10),
  resistance: extend(dispelOrResistanceV10),
  savingThrowType: extend(savingThrowTypeV10),
};

export type ItemFeatureBlockV10 = Readonly<{
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
