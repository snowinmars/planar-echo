import type {
  GameLanguage,
  NpcDialogue,
  Say,
  StateId,
  Response,
  ResponseId,
  Maybe,
} from '@planar/shared';
import { nothing } from '@planar/shared';

export const getStateIds = (tree: Maybe<NpcDialogue>): StateId[] => {
  if (!tree) return [];
  return [...tree.tree.keys()];
};

export const getSaysResponses = (tree: NpcDialogue, gameLanguage: GameLanguage, currentStateId: StateId): Readonly<{
  says: Say[];
  responses: Response[];
}> => {
  const state = tree.tree.get(currentStateId)!;
  const says = state.says.get(gameLanguage)!;
  const responses = state.responses.get(gameLanguage)!;

  return {
    says,
    responses,
  };
};

export const getExternDialogueId = (responseId: ResponseId, targetStateId: StateId): Maybe<string> => {
  const sourceDialogueId = responseId.split('_')[0];
  const targetDiralogueId = targetStateId.split('_')[0];

  const isExtern = sourceDialogueId !== targetDiralogueId;
  if (isExtern) return targetDiralogueId;
  return nothing();
};

export const isDestructor = (stateId: StateId) => stateId.endsWith('destructor');

export const chooseStartingStateId = (tree: NpcDialogue): StateId => {
  for (const [stateId] of tree.constructorsWeights) { // [stateId, weight]
    const s = tree.tree.get(stateId)!;
    if (s.args?.onlyIf?.()) return stateId;
  }
  return tree.tree.keys().next().value!;
};
