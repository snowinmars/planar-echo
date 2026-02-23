import { readString, readUint } from '../../../pipes/readers.js';
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

const readHeader = (buffer: Buffer, offset: number): PlainNpcDialogueHeader => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const signature               = readString(buffer, offset, 4).trim();
  const version                 = readString(buffer, offset + 4, 4).trim();

  const statesCount             = readUint(buffer, offset + 8);
  const statesOffset            = readUint(buffer, offset + 12);
  const responsesCount          = readUint(buffer, offset + 16);
  const responsesOffset         = readUint(buffer, offset + 20);
  const stateTriggersOffset     = readUint(buffer, offset + 24);
  const stateTriggersCount      = readUint(buffer, offset + 28);
  const responsesTriggersOffset = readUint(buffer, offset + 32);
  const responseTriggersCount   = readUint(buffer, offset + 36);
  const actionsOffset           = readUint(buffer, offset + 40);
  const actionsCount            = readUint(buffer, offset + 44);

  const threatResponse          = statesOffset > 0x30 ? readUint(buffer, offset + 48) : 0;
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

const readStates = (buffer: Buffer, offset: number, numberOfStates: number): PlainNpcDialogueState[] => {
  const states: PlainNpcDialogueState[] = [];

  for (let i = 0; i < numberOfStates; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const textRef            = readUint(buffer, offset);
    const firstResponseIndex = readUint(buffer, offset + 4);
    const responsesCount     = readUint(buffer, offset + 8);
    const triggerIndex       = readUint(buffer, offset + 12);
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

    offset += 16;
  }

  return states;
};

const readResponses = (buffer: Buffer, offset: number, numberOfResponses: number): PlainNpcDialogueResponse[] => {
  const responses: PlainNpcDialogueResponse[] = [];
  for (let i = 0; i < numberOfResponses; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const flags           = readUint  (buffer, offset);
    const textRef         = readUint  (buffer, offset +  4);
    const journalRef      = readUint  (buffer, offset +  8);
    const triggerIndex    = readUint  (buffer, offset + 12);
    const actionIndex     = readUint  (buffer, offset + 16);
    const nextDialog      = readString(buffer, offset + 20, offset + 28);
    const nextDialogState = readUint  (buffer, offset + 28);
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
    offset += 32;
  }

  return responses;
};

const readStateTriggers = (buffer: Buffer, offset: number, numberOfStateTriggers: number): PlainNpcDialogueStateTrigger[] => {
  const stateTriggers: PlainNpcDialogueStateTrigger[] = [];

  for (let i = 0; i < numberOfStateTriggers; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const off  = readUint  (buffer, offset);
    const len  = readUint  (buffer, offset + 4);
    const text = readString(buffer, off, len).trim();
    /* eslint-enable */

    const stateTrigger: PlainNpcDialogueStateTrigger = {
      index: i,
      offset: off,
      length: len,
      text,
    };

    stateTriggers.push(stateTrigger);

    offset += 8;
  }

  return stateTriggers;
};

const readResponsesTriggers = (buffer: Buffer, offset: number, numberOfResponseTriggers: number): PlainNpcDialogueResponseTrigger[] => {
  const responsesTriggers: PlainNpcDialogueResponseTrigger[] = [];

  for (let i = 0; i < numberOfResponseTriggers; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const off  = readUint  (buffer, offset);
    const len  = readUint  (buffer, offset + 4);
    const text = readString(buffer, off, len).trim();
    /* eslint-enable */

    const responseTrigger: PlainNpcDialogueResponseTrigger = {
      index: i,
      offset: off,
      length: len,
      text,
    };

    responsesTriggers.push(responseTrigger);

    offset += 8;
  }

  return responsesTriggers;
};

const readActions = (buffer: Buffer, offset: number, numberOfActions: number): PlainNpcDialogueAction[] => {
  const actions: PlainNpcDialogueAction[] = [];

  for (let i = 0; i < numberOfActions; i++) {
    /* eslint-disable @stylistic/no-multi-spaces */
    const off  = readUint  (buffer, offset);
    const len  = readUint  (buffer, offset + 4);
    const text = readString(buffer, off, len).trim();
    /* eslint-enable */

    const action: PlainNpcDialogueAction = {
      index: i,
      offset: off,
      length: len,
      text,
    };

    actions.push(action);

    offset += 8;
  }

  return actions;
};

const readDlgBuffer = (buffer: Buffer, resourceName: string): PlainNpcDialogue => {
  const header: PlainNpcDialogueHeader = readHeader(
    buffer,
    0,
  );

  if (header.signature !== 'DLG') throw new Error(`Unsupported signature: ${header.signature}`);
  if (header.version !== 'V1.0') throw new Error(`Unsupported version: ${header.version}`);

  const states: PlainNpcDialogueState[] = readStates(
    buffer,
    header.statesOffset,
    header.statesCount,
  );
  const responses: PlainNpcDialogueResponse[] = readResponses(
    buffer,
    header.responsesOffset,
    header.responsesCount,
  );
  const stateTriggers: PlainNpcDialogueStateTrigger[] = readStateTriggers(
    buffer,
    header.stateTriggersOffset,
    header.stateTriggersCount,
  );
  const responsesTriggers: PlainNpcDialogueResponseTrigger[] = readResponsesTriggers(
    buffer,
    header.responsesTriggersOffset,
    header.responseTriggersCount,
  );
  const actions: PlainNpcDialogueAction[] = readActions(
    buffer,
    header.actionsOffset,
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
