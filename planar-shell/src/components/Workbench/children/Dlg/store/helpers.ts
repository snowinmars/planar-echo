import type {
  GhostDlg,
  StateId,
  ResponseId,
  Maybe,
} from '@planar/shared';
import { isNothing, just, nothing } from '@planar/shared';

export type DisposeFunction = () => void;

export const getStateIds = (tree: Maybe<GhostDlg>): StateId[] => {
  if (!tree) return [];
  return [...tree.tree.keys()];
};

export const getExternDlgId = (responseId: ResponseId, targetStateId: StateId): Maybe<string> => {
  const sourceDlgId = responseId.split('_')[0];
  const targetDiralogueId = targetStateId.split('_')[0];

  const isExtern = sourceDlgId !== targetDiralogueId;
  if (isExtern) return `${targetDiralogueId}.dlg`;
  return nothing();
};

export const isDestructor = (stateId: StateId) => stateId.endsWith('destructor');

const constructorStateIdsByWeight = (tree: GhostDlg): StateId[] => (
  [...tree.constructorsWeights.entries()]
    .sort(([, weightA], [, weightB]) => weightA - weightB)
    .map(([stateId]) => stateId)
);

export const pickMatchingConstructorStateId = (tree: GhostDlg): Maybe<StateId> => {
  for (const stateId of constructorStateIdsByWeight(tree)) {
    const label = tree.tree.get(stateId);
    if (label?.args?.onlyIf?.()) return stateId;
  }
  return nothing();
};

export const chooseStartingStateId = (tree: GhostDlg): StateId => {
  const matched = pickMatchingConstructorStateId(tree);
  if (matched) return matched;
  const firstStateId = tree.tree.keys().next().value!;
  return firstStateId;
};

export const mapTlkRefs = (entries: Readonly<{ ref: Maybe<number> }>[]): number[] => (
  [
    ...new Set<number>(entries
      .filter(x => !isNothing(x.ref))
      .map(x => just(x.ref))),
  ]
);
