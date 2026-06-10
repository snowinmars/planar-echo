import type {
  GameLanguage,
  TranslatedNpcDialogue,
  TranslatedSay,
  StateId,
  TranslatedResponse,
  ResponseId,
  Maybe,
} from '@planar/shared';
import { nothing } from '@planar/shared';

export const getStateIds = (tree: Maybe<TranslatedNpcDialogue>): StateId[] => {
  if (!tree) return [];
  return [...tree.tree.keys()];
};

export const getSaysResponses = (tree: TranslatedNpcDialogue, gameLanguage: GameLanguage, currentStateId: StateId): Readonly<{
  says: TranslatedSay[];
  responses: TranslatedResponse[];
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
  if (isExtern) return `${targetDiralogueId}.dlg`;
  return nothing();
};

export const isDestructor = (stateId: StateId) => stateId.endsWith('destructor');

const constructorStateIdsByWeight = (tree: TranslatedNpcDialogue): StateId[] => (
  [...tree.constructorsWeights.entries()]
    .sort(([, weightA], [, weightB]) => weightA - weightB)
    .map(([stateId]) => stateId)
);

export const pickMatchingConstructorStateId = (tree: TranslatedNpcDialogue): Maybe<StateId> => {
  for (const stateId of constructorStateIdsByWeight(tree)) {
    const label = tree.tree.get(stateId);
    if (label?.args?.onlyIf?.()) return stateId;
  }
  return nothing();
};

export const chooseStartingStateId = (tree: TranslatedNpcDialogue): StateId => {
  const matched = pickMatchingConstructorStateId(tree);
  if (matched) return matched;
  return tree.tree.keys().next().value!;
};
