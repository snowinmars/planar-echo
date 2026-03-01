import { extend } from '../../../../pipes/offsetMap.js';

const targetTypeV20 = {
  0: 'none',
  1: 'self (pre-projectile)',
  2: 'pre-target',
  3: 'party',
  4: 'everyone (inc. party)',
  5: 'everyone (excl. party)',
  6: 'Everyone matching specific value of caster (or Party if cast by party member)',
  7: 'everyone matching specific value of target',
  8: 'everyone (excl. caster)',
  9: 'self (post-projectile)',
} as const;
type TargetTypeV20 = typeof targetTypeV20[keyof typeof targetTypeV20];

const timingModeV20 = {
  0: 'duration',
  1: 'permanent',
  2: 'while equipped',
  3: 'delayed duration',
  4: 'delayed',
  5: 'delayed (transforms to 8)',
  6: 'duration?',
  7: 'permanent?',
  8: 'permanent (unsaved)',
  9: 'permanent (after death)',
  10: 'trigger',
  4096: 'absolute duration',
} as const;
type TimingModeV20 = typeof timingModeV20[keyof typeof timingModeV20];

const resistanceV20 = {
  0: 'nonmagical',
  1: 'can be dispelled/affected by resistance',
  2: 'cannot be dispelled/ignores resistance',
  3: 'can be dispelled/ignores resistance',
} as const;
type ResistanceV20 = typeof resistanceV20[keyof typeof resistanceV20];

const savingThrowTypeV20 = {
  0: 'spells',
  1: 'breathe',
  2: 'death',
  3: 'wands',
  4: 'polymorph',
} as const;
type SavingThrowTypeV20 = typeof savingThrowTypeV20[keyof typeof savingThrowTypeV20];

export const offsetMap = {
  targetType: extend(targetTypeV20),
  timingMode: extend(timingModeV20),
  resistance: extend(resistanceV20),
  savingThrowType: extend(savingThrowTypeV20),
};

export type ItemFeatureBlockV20 = Readonly<{
  opcodeNumber: number;
  targetType: TargetTypeV20;
  power: number;
  parameter1: number;
  parameter2: number;
  timingMode: TimingModeV20;
  resistance: ResistanceV20;
  duration: number;
  probability1: number;
  probability2: number;
  resource: string;
  diceThrown: number;
  diceSides: number;
  savingThrowType: SavingThrowTypeV20;
  savingThrowBonus: number;
  special: number;
}>;
