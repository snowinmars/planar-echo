import { extendMap } from './15.parseAutomapNotes.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawAreAutomapNoteV10 } from './15.parseAutomapNotes.types.js';

const toStrrefLocation = (x: number): RawAreAutomapNoteV10['strrefLocation'] => {
  switch (x) {
    case 0: return 'toh/tot';
    case 1: return 'tlk';
    default: throw new Error(`Out of range: cannot convert '${x}' to StrrefLocation`);
  }
};

const parseAutomapNote = (reader: BufferReader): RawAreAutomapNoteV10 => {
  const x = reader.ushort();
  const y = reader.ushort();
  const textRef = reader.uint();
  const rawStrrefLocation = reader.ushort();
  const strrefLocation = toStrrefLocation(rawStrrefLocation);
  const markerColor = reader.map.ushort(extendMap.markerColor.parse);
  const controlId = reader.uint();
  reader.skip.custom(36);

  const rawAreAutomapNoteV10: RawAreAutomapNoteV10 = {
    at: {
      x,
      y,
    },
    textRef,
    strrefLocation,
    markerColor,
    controlId,
  };

  return rawAreAutomapNoteV10;
};

type ParseAutomapNotesProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseAutomapNotes = ({
  reader,
  count,
}: ParseAutomapNotesProps): RawAreAutomapNoteV10[] => {
  const notes: RawAreAutomapNoteV10[] = [];

  for (let i = 0; i < count; i++) notes.push(parseAutomapNote(reader));

  return notes;
};
