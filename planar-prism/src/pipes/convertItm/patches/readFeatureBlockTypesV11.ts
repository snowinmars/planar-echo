import { extend } from '../../../pipes/offsetMap.js';

const targetTypeV11 = {
  0: 'none',
  1: 'self (pre-projectile)',
  2: 'pre-target',
  3: 'party',
  4: 'everyone (inc. party)',
  5: 'everyone (excl. party)',
} as const;
type TargetTypeV11 = typeof targetTypeV11[keyof typeof targetTypeV11];

const timingModeV11 = {
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
type TimingModeV11 = typeof timingModeV11[keyof typeof timingModeV11];

const resistanceV11 = {
  0: 'nonmagical',
  1: 'can be dispelled/affected by resistance',
  2: 'cannot be dispelled/ignores resistance',
  3: 'can be dispelled/ignores resistance',
} as const;
type ResistanceV11 = typeof resistanceV11[keyof typeof resistanceV11];

const savingThrowTypeV11 = {
  0: 'spells',
  1: 'breathe',
  2: 'death',
  3: 'wands',
  4: 'polymorph',
} as const;
type SavingThrowTypeV11 = typeof savingThrowTypeV11[keyof typeof savingThrowTypeV11];

export const offsetMap = {
  targetType: extend(targetTypeV11),
  timingMode: extend(timingModeV11),
  resistance: extend(resistanceV11),
  savingThrowType: extend(savingThrowTypeV11),
};

export type ItemFeatureBlockV11 = Readonly<{
  opcodeNumber: number;
  targetType: TargetTypeV11;
  power: number;
  parameter1: number;
  parameter2: number;
  timingMode: TimingModeV11;
  resistance: ResistanceV11;
  duration: number;
  probability1: number;
  probability2: number;
  resource: string;
  diceThrown: number;
  diceSides: number;
  savingThrowType: SavingThrowTypeV11[];
  savingThrowBonus: number;
  special: number;
}>;
