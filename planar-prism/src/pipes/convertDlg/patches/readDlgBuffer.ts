import createReader, { type BufferReader } from '../../../pipes/readers.js';
import type {
  PlainNpcDialogueHeader,
  PlainNpcDialogueState,
  PlainNpcDialogueResponse,
  PlainNpcDialogueStateTrigger,
  PlainNpcDialogueResponseTrigger,
  PlainNpcDialogueAction,
  PlainNpcDialogue,
} from '../types.js';

const intMax = 4294967295;

// TODO [snow]: fails with `Invalid TLK flags '25': contains unknown bits 0x10, when known is 0xf`, but https://gibberlings3.github.io/iesdp/file_formats/ie_formats/tlk_v1.htm does not mention 2^5 flag. Fix it.
// export const parseTlkFlag = (flags: number): TlkFlag => {
//   if (flags < 0 || flags > 0xffff) throw new Error(`Invalid TLK flags value '${flags}': out of TlkFlag enum bit range)`);

//   const knownFlags = TlkFlag.hasText | TlkFlag.hasSound | TlkFlag.hasComplex | TlkFlag.hasToken;

//   const unknownBits = flags & ~knownFlags;
//   if (unknownBits !== 0) throw new Error(`Invalid TLK flags '${flags}': contains unknown bits 0x${unknownBits.toString(16)}, when known is 0x${knownFlags.toString(16)}`);

//   return flags;
// };

const readHeader = (reader: BufferReader): PlainNpcDialogueHeader => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const signature               = reader.string(4);
  const version                 = reader.string(4);

  const statesCount             = reader.uint();
  const statesOffset            = reader.uint();
  const responsesCount          = reader.uint();
  const responsesOffset         = reader.uint();
  const stateTriggersOffset     = reader.uint();
  const stateTriggersCount      = reader.uint();
  const responsesTriggersOffset = reader.uint();
  const responseTriggersCount   = reader.uint();
  const actionsOffset           = reader.uint();
  const actionsCount            = reader.uint();

  const threatResponse          = statesOffset > 0x30 ? reader.uint() : 0;
  /* eslint-enable */

  return {
    signature,
    version,
    statesCount,
    statesOffset,
    responsesCount,
    responsesOffset,
    stateTriggersCount,
    stateTriggersOffset,
    responseTriggersCount,
    responsesTriggersOffset,
    actionsCount,
    actionsOffset,
    threatResponse,
  };
};

const readStates = (reader: BufferReader, numberOfStates: number): PlainNpcDialogueState[] => {
  const states: PlainNpcDialogueState[] = [];

  for (let i = 0; i < numberOfStates; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const textRef            = reader.uint();
    const firstResponseIndex = reader.uint();
    const responsesCount     = reader.uint();
    const triggerIndex       = reader.uint();
    /* eslint-enable */

    const _textRef = textRef === intMax ? -1 : textRef;
    const _triggerIndex = triggerIndex === intMax ? -1 : triggerIndex;

    const state: PlainNpcDialogueState = {
      index: i,
      textRef: _textRef,
      text: `UNTRANSLATED STATE ${_textRef}`, // may be overrided in the patchTranslation patch
      soundResRef: '', // may be overrided in the patchTranslation patch
      flags: 0, // may be overrided in the patchTranslation patch
      firstResponseIndex,
      responsesCount,
      triggerIndex: _triggerIndex,
      stateOrigins: [],
      weightStates: [],
    };

    states.push(state);
  }

  return states;
};

const readResponses = (reader: BufferReader, numberOfResponses: number): PlainNpcDialogueResponse[] => {
  const responses: PlainNpcDialogueResponse[] = [];
  for (let i = 0; i < numberOfResponses; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const flags           = reader.uint();
    const textRef         = reader.uint();
    const journalRef      = reader.uint();
    const triggerIndex    = reader.uint();
    const actionIndex     = reader.uint();
    const nextDialog      = reader.string(8);
    const nextDialogState = reader.uint();
    /* eslint-enable */

    const _textRef = textRef === intMax ? -1 : textRef;
    const _triggerIndex = triggerIndex === intMax ? -1 : triggerIndex;

    const response: PlainNpcDialogueResponse = {
      index: i,
      textRef: _textRef,
      text: `UNTRANSLATED RESPONSE ${_textRef}`, // may be overrided in the patchTranslation patch
      soundResRef: '', // may be overrided in the patchTranslation patch
      flags, // may be overrided in the patchTranslation patch
      journalRef,
      journal: '', // may be overrided in the patchTranslation patch
      triggerIndex: _triggerIndex,
      actionIndex,
      nextDialog,
      nextDialogState,
    };

    responses.push(response);
  }

  return responses;
};

const readStateTriggers = (reader: BufferReader, numberOfStateTriggers: number): PlainNpcDialogueStateTrigger[] => {
  const stateTriggers: PlainNpcDialogueStateTrigger[] = [];

  for (let i = 0; i < numberOfStateTriggers; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const off  = reader.uint();
    const len  = reader.uint();
    const text = reader.fork(off).string(len);
    /* eslint-enable */

    const stateTrigger: PlainNpcDialogueStateTrigger = {
      index: i,
      offset: off,
      length: len,
      text,
    };

    stateTriggers.push(stateTrigger);
  }

  return stateTriggers;
};

const readResponsesTriggers = (reader: BufferReader, numberOfResponseTriggers: number): PlainNpcDialogueResponseTrigger[] => {
  const responsesTriggers: PlainNpcDialogueResponseTrigger[] = [];

  for (let i = 0; i < numberOfResponseTriggers; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const off  = reader.uint();
    const len  = reader.uint();
    const text = reader.fork(off).string(len);
    /* eslint-enable */

    const responseTrigger: PlainNpcDialogueResponseTrigger = {
      index: i,
      offset: off,
      length: len,
      text,
    };

    responsesTriggers.push(responseTrigger);
  }

  return responsesTriggers;
};

const readActions = (reader: BufferReader, numberOfActions: number): PlainNpcDialogueAction[] => {
  const actions: PlainNpcDialogueAction[] = [];

  for (let i = 0; i < numberOfActions; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const off  = reader.uint();
    const len  = reader.uint();
    const text = reader.fork(off).string(len);
    /* eslint-enable */

    const action: PlainNpcDialogueAction = {
      index: i,
      offset: off,
      length: len,
      text,
    };

    actions.push(action);
  }

  return actions;
};

const readDlgBuffer = (buffer: Buffer, resourceName: string): PlainNpcDialogue => {
  const reader = createReader(buffer);

  const header: PlainNpcDialogueHeader = readHeader(reader);

  if (header.signature !== 'dlg') throw new Error(`Unsupported signature: ${header.signature}`);
  if (header.version !== 'v1.0') throw new Error(`Unsupported version: ${header.version}`);

  const states: PlainNpcDialogueState[] = readStates(
    reader.fork(header.statesOffset),
    header.statesCount,
  );
  const responses: PlainNpcDialogueResponse[] = readResponses(
    reader.fork(header.responsesOffset),
    header.responsesCount,
  );
  const stateTriggers: PlainNpcDialogueStateTrigger[] = readStateTriggers(
    reader.fork(header.stateTriggersOffset),
    header.stateTriggersCount,
  );
  const responsesTriggers: PlainNpcDialogueResponseTrigger[] = readResponsesTriggers(
    reader.fork(header.responsesTriggersOffset),
    header.responseTriggersCount,
  );
  const actions: PlainNpcDialogueAction[] = readActions(
    reader.fork(header.actionsOffset),
    header.actionsCount,
  );

  return {
    header,
    states,
    responses,
    stateTriggers,
    responsesTriggers,
    actions,
    resourceName,
    stateIndicesOrderedByWeight: [], // may be overrided in the attachWeights patch
  };
};

export default readDlgBuffer;
