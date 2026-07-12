import { NumberVariableId, BooleanVariableId, ClassId, StatId } from '@planar/shared';

export type NumberVariable<_K extends NumberVariableId> = number; // eslint-disable-line @typescript-eslint/no-unused-vars
export type BooleanVariable<_K extends BooleanVariableId> = boolean; // eslint-disable-line @typescript-eslint/no-unused-vars

export type CharacterNarrativeProps = Record<StatId, number> & Readonly<{
  theClass: ClassId;
  levelFirstClass: number;
  levelSecondClass: number;
  levelThirdClass: number;
}>;
