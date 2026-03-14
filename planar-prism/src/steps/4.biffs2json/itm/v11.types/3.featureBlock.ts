import { extend } from '../../../../pipes/offsetMap.js';

/* createGenerator().register().enum("targetTypeV11",
 *   ['none','self (pre-projectile)','pre-target','party','everyone (inc. party)','everyone (excl. party)',]
 * ).write();
 */
const targetTypeV11 = {
  0: 'none',
  1: 'self (pre-projectile)',
  2: 'pre-target',
  3: 'party',
  4: 'everyone (inc. party)',
  5: 'everyone (excl. party)',
} as const;
type TargetTypeV11 = typeof targetTypeV11[keyof typeof targetTypeV11];

/* createGenerator().register().enum("timingModeV11", {
 *   0: ['duration','permanent','while equipped','delayed duration','delayed','delayed (transforms to 8)','duration?','permanent?','permanent (unsaved)','permanent (after death)','trigger'],
 *   4096: ['absolute duration']
 * }).write();
 */
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

/* createGenerator().register().enum("resistanceV11",
 *   ['nonmagical','can be dispelled/affected by resistance','cannot be dispelled/ignores resistance','can be dispelled/ignores resistance',]
 * ).write();
 */
const resistanceV11 = {
  0: 'nonmagical',
  1: 'can be dispelled/affected by resistance',
  2: 'cannot be dispelled/ignores resistance',
  3: 'can be dispelled/ignores resistance',
} as const;
type ResistanceV11 = typeof resistanceV11[keyof typeof resistanceV11];

/* createGenerator().register().flags("savingThrowTypeV11", {
 *   byte1: ['spells','breathe','death','wands','polymorph',]
 * }).write();
 */
const savingThrowTypeV11 = {
  // byte1
  0x1: 'spells',
  0x2: 'breathe',
  0x4: 'death',
  0x8: 'wands',
  0x10: 'polymorph',
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type SavingThrowTypeV11 = typeof savingThrowTypeV11[keyof typeof savingThrowTypeV11];

export const offsetMap = {
  targetType: extend(targetTypeV11),
  timingMode: extend(timingModeV11),
  resistance: extend(resistanceV11),
  savingThrowType: extend(savingThrowTypeV11),
};

export type FeatureBlockV11 = Readonly<{
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
