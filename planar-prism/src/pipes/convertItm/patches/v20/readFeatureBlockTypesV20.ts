import { extend } from '../../../../pipes/offsetMap.js';

/* createGenerator().register().enum("targetTypeV20",
 *   ['none','self (pre-projectile)','pre-target','party','everyone (inc. party)','everyone (excl. party)','Everyone matching specific value of caster (or Party if cast by party member)','everyone matching specific value of target','everyone (excl. caster)','self (post-projectile)',]
 * ).write();
 */
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

/* createGenerator().register().enum("timingModeV20", {
 *   0: ['duration','permanent','while equipped','delayed duration','delayed','delayed (transforms to 8)','duration?','permanent?','permanent (unsaved)','permanent (after death)','trigger'],
 *   4096: ['absolute duration']
 * }).write();
 */
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

/* createGenerator().register().enum("resistanceV20",
 *   ['nonmagical','can be dispelled/affected by resistance','cannot be dispelled/ignores resistance','can be dispelled/ignores resistance',]
 * ).write();
 */
const resistanceV20 = {
  0: 'nonmagical',
  1: 'can be dispelled/affected by resistance',
  2: 'cannot be dispelled/ignores resistance',
  3: 'can be dispelled/ignores resistance',
} as const;
type ResistanceV20 = typeof resistanceV20[keyof typeof resistanceV20];

/* createGenerator().register().flags("savingThrowTypeV20", {
 *   byte1: ['spells','breathe','death','wands','polymorph',]
 * }).write();
 */
const savingThrowTypeV20 = {
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
  savingThrowType: SavingThrowTypeV20[];
  savingThrowBonus: number;
  special: number;
}>;
