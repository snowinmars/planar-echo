import type {
  PlainNpcDialogue,
  PlainNpcDialogueStateTrigger,
  PlainNpcDialogueResponseTrigger,
  PlainNpcDialogueAction,
  NpcDialogue,
  NpcDialogueState,
  NpcDialogueResponse,
} from '../types.js';

export const nestDialogue = (dialogue: PlainNpcDialogue): NpcDialogue => {
  const stateTriggersByIdx = new Map<number, PlainNpcDialogueStateTrigger>();
  const responseTriggersByIdx = new Map<number, PlainNpcDialogueResponseTrigger>();
  const actionsByIdx = new Map<number, PlainNpcDialogueAction>();

  for (const trigger of dialogue.stateTriggers) stateTriggersByIdx.set(trigger.index, trigger);
  for (const trigger of dialogue.responsesTriggers) responseTriggersByIdx.set(trigger.index, trigger);
  for (const action of dialogue.actions) actionsByIdx.set(action.index, action);

  const nestedStates: NpcDialogueState[] = dialogue.states.map((state) => {
    const responses: NpcDialogueResponse[] = [];
    const startIdx = state.firstResponseIndex;
    const endIdx = startIdx + state.responsesCount;

    for (let i = startIdx; i < endIdx; i++) {
      const resp = dialogue.responses[i]!;

      const response: NpcDialogueResponse = {
        index: resp.index,
        text: resp.text,
        textRef: resp.textRef,
        soundResRef: resp.soundResRef,
        flags: resp.flags,
        journal: resp.journal,
        journalRef: resp.journalRef,
        trigger: (resp.triggerIndex >= 0) ? (responseTriggersByIdx.get(resp.triggerIndex) || null) : null,
        action: (resp.actionIndex >= 0) ? (actionsByIdx.get(resp.actionIndex) || null) : null,
        nextDialog: resp.nextDialog,
        nextDialogState: resp.nextDialogState,
      };

      responses.push(response);
    }

    return {
      index: state.index,
      text: state.text,
      textRef: state.textRef,
      soundResRef: state.soundResRef,
      flags: state.flags,
      trigger: state.triggerIndex >= 0
        ? stateTriggersByIdx.get(state.triggerIndex) || null
        : null,
      responses,
      origins: state.stateOrigins,
      weightStates: state.weightStates,
    };
  });

  return {
    resourceName: dialogue.resourceName,
    header: dialogue.header,
    states: nestedStates,
    stateIndicesOrderedByWeight: dialogue.stateIndicesOrderedByWeight,
  };
};

export default nestDialogue;
