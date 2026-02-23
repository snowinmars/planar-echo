export type TlkFlag = number;

export type PlainNpcDialogueHeader = Readonly<{
  signature: string;
  version: string;
  statesCount: number;
  statesOffset: number;
  responsesCount: number;
  responsesOffset: number;
  stateTriggersCount: number;
  stateTriggersOffset: number;
  responseTriggersCount: number;
  responsesTriggersOffset: number;
  actionsCount: number;
  actionsOffset: number;
  threatResponse: number;
}>;

export type PlainNpcDialogueState = Readonly<{
  index: number;
  textRef: number;
  text: string;
  soundResRef: string;
  flags: TlkFlag;
  firstResponseIndex: number;
  responsesCount: number;
  triggerIndex: number;
  stateOrigins: Readonly<{
    stateIndex: number;
    responseIndex: number;
  }>[];
  weightStates: number[];
}>;

export type PlainNpcDialogueResponse = Readonly<{
  index: number;
  flags: TlkFlag;
  textRef: number;
  text: string;
  soundResRef: string;
  journalRef: number;
  journal: string;
  triggerIndex: number;
  actionIndex: number;
  nextDialog: string;
  nextDialogState: number;
}>;

export type PlainNpcDialogueStateTrigger = Readonly<{
  index: number;
  offset: number;
  length: number;
  text: string;
}>;

export type PlainNpcDialogueResponseTrigger = Readonly<{
  index: number;
  offset: number;
  length: number;
  text: string;
}>;

export type PlainNpcDialogueAction = Readonly<{
  index: number;
  offset: number;
  length: number;
  text: string;
}>;

export type PlainNpcDialogue = Readonly<{
  resourceName: string;
  header: PlainNpcDialogueHeader;
  states: PlainNpcDialogueState[];
  responses: PlainNpcDialogueResponse[];
  stateTriggers: PlainNpcDialogueStateTrigger[];
  responsesTriggers: PlainNpcDialogueResponseTrigger[];
  actions: PlainNpcDialogueAction[];
  stateIndicesOrderedByWeight: number[];
}>;

///

export type NpcDialogueHeader = Readonly<{
  signature: string;
  version: string;
  statesCount: number;
  statesOffset: number;
  responsesCount: number;
  responsesOffset: number;
  stateTriggersCount: number;
  stateTriggersOffset: number;
  responseTriggersCount: number;
  responsesTriggersOffset: number;
  actionsCount: number;
  actionsOffset: number;
  threatResponse: number;
}>;

export type NpcDialogueState = Readonly<{
  index: number;
  text: string;
  textRef: number;
  soundResRef: string;
  flags: number;
  trigger: NpcDialogueStateTrigger | null;
  responses: NpcDialogueResponse[];
  origins: Readonly<{
    stateIndex: number;
    responseIndex: number;
  }>[];
  weightStates: number[];
}>;

export type NpcDialogueResponse = Readonly<{
  index: number;
  text: string;
  textRef: number;
  soundResRef: string;
  flags: number;
  journal: string;
  journalRef: number;
  trigger: NpcDialogueResponseTrigger | null;
  action: NpcDialogueAction | null;
  nextDialog: string;
  nextDialogState: number;
}>;

export type NpcDialogueStateTrigger = Readonly<{
  index: number;
  offset: number;
  length: number;
  text: string;
}>;

export type NpcDialogueResponseTrigger = Readonly<{
  index: number;
  offset: number;
  length: number;
  text: string;
}>;

export type NpcDialogueAction = Readonly<{
  index: number;
  offset: number;
  length: number;
  text: string;
}>;

export type NpcDialogue = Readonly<{
  resourceName: string;
  header: NpcDialogueHeader;
  states: NpcDialogueState[];
  stateIndicesOrderedByWeight: number[];
}>;
