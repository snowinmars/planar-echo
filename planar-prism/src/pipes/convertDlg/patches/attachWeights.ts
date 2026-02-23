import type { PlainNpcDialogue } from '../types.js';

const attachWeights = (dialogue: PlainNpcDialogue): PlainNpcDialogue => {
  const stateIndicesOrderedByWeight = dialogue.states
    .filter(s => s.triggerIndex >= 0)
    .sort((lhs, rhs) => {
      // Order states by trigger index, then by state index
      // Am I right, that it works as NearInfinity->DlgResource->'scanning for state origins and weight information'?
      if (lhs.triggerIndex !== rhs.triggerIndex) return lhs.triggerIndex - rhs.triggerIndex;
      return lhs.index - rhs.index;
    })
    .map(s => s.index);

  return {
    ...dialogue,
    stateIndicesOrderedByWeight,
  };
};

export default attachWeights;
