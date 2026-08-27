import type { Maybe } from '../maybe.js';

export type GhostEffTargetTypeV20
  = | 'none'
    | 'self'
    | 'projectile target'
    | 'party'
    | 'everyone'
    | 'everyone except party'
    | 'caster group'
    | 'target group'
    | 'everyone except self'
    | 'original caster'
  ;

export type GhostEffTypeV20
  = | 'none'
    | 'self'
    | 'projectile target'
    | 'party'
    | 'everyone'
    | 'everyone except party'
    | 'caster group'
    | 'target group'
    | 'everyone except self'
    | 'original caster'
    | 'strength bonus'
    | 'cast spell'
    | 'modify global variable';

export type GhostEffTimingModeV20
  = | 'instant/limited'
    | 'instant/permanent'
    | 'instant/while equipped'
    | 'delay/limited'
    | 'delay/permanent'
    | 'delay/while equipped'
    | 'limited after duration'
    | 'permanent after duration'
    | 'equipped after duration'
    | 'instant/permanent (after death)'
    | 'absolute duration';

export type GhostEffSavingThrowTypeV20
  = | 'spells'
    | 'breath'
    | 'paralyze/poison/death'
    | 'wands'
    | 'petrify/polymorph'
    | 'spells (ee only)'
    | 'breath (ee only)'
    | 'paralyze/poison/death (ee only)'
    | 'wands (ee only)'
    | 'petrify/polymorph (ee only)'
    | 'ignore primary target (ee only)'
    | 'ignore secondary target (ee only)'
    | 'bypass mirror image (ee/tobex only)'
    | 'ignore difficulty (ee only)/limit effect stacking (tobex only)'
    | 'tobex internal (don’t use)';

export type GhostEffDispelOrResistanceV20
  = | 'dispel'
    | 'bypass resistance'
    | 'bypasses opcodes 199 200 201 259'
    | 'self targeted'
    | 'effect applied by item';

export type GhostEffParentResourceTypeV20 = 'none' | 'spell' | 'item';

export type GhostEffParentResourceFlagsV20
  = | 'hostile'
    | 'no los required'
    | 'allow spotting'
    | 'outdoors only'
    | 'non-magical ability'
    | 'ignore wild surge'
    | 'non-combat ability';

export type GhostEffV20 = Readonly<{
  resourceName: string;
  signature: 'eff';
  version: 'v2.0';
  externalEffectsSignature: string;
  externalEffectsVersion: string;
  type: GhostEffTypeV20;
  targetType: GhostEffTargetTypeV20;
  power: number;
  parameter1: number;
  parameter2: number;
  timingMode: GhostEffTimingModeV20;
  duration: number;
  probability1: number;
  probability2: number;
  resRef: string;
  diceThrown: number;
  diceSides: number;
  savingThrowType: GhostEffSavingThrowTypeV20[];
  saveBonus: number;
  special: number;
  primaryTypeSchool: number;
  minimumLevel?: Maybe<number>;
  maximumLevel?: Maybe<number>;
  dispelOrResistance: GhostEffDispelOrResistanceV20[];
  parameter3: number;
  parameter4: number;
  parameter5?: Maybe<number>;
  timeApplied?: Maybe<number>;
  resource2Ref: string;
  resource3Ref: string;
  casterXcoordinate: number;
  casterYcoordinate: number;
  targetXcoordinate: number;
  targetYcoordinate: number;
  parentResourceType: GhostEffParentResourceTypeV20;
  parentResourceRef: string;
  parentResourceFlags: GhostEffParentResourceFlagsV20[];
  projectile: number;
  parentResourceSlot: number;
  variableName: string;
  casterLevel: number;
  firstApply: number;
  secondaryType: number;
}>;

export type GhostEff = GhostEffV20;
