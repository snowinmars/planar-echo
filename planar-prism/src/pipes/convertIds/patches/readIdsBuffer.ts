import type { GameName, PartialWriteable } from '../../../shared/types.js';
import type { Ids } from './readIdsBufferTypes.js';
import createReader from '../../../pipes/readers.js';
import readKeyValue from './readKeyValue.js';

const readCreatureBuffer = (buffer: Buffer, resourceName: string, gameName: GameName): Ids => {
  const reader = createReader(buffer);
  const tmp: PartialWriteable<Ids> = {};
  tmp.header = {
    wrongSignature: 'n/a',
    wrongEntryCount: 'n/a',
  };
  tmp.entries = new Map<number, string[]>();

  for (const line of reader.readLineByLine()) {
    const result = readKeyValue(line, resourceName);

    switch (result.type) {
      case 'IdsParsed': {
        if (tmp.entries.has(result.key)) tmp.entries.get(result.key)!.push(result.value);
        else tmp.entries.set(result.key, [result.value]);
        break;
      }
      case 'SignatureParsed': {
        tmp.header.wrongSignature = result.wrongSignature;
        break;
      }
      case 'EntryCountParsed': {
        tmp.header.wrongEntryCount = result.wrongEntryCount;
        break;
      }
      case 'FailedParsed': {
        continue;
      }
      // @ts-expect-error // just to be sure
      default: throw new Error(`readKeyValue result type is out of range: '${result.type}' in file ${resourceName}`);
    }
  }

  return {
    resourceName,
    header: {
      wrongSignature: tmp.header.wrongSignature,
      wrongEntryCount: tmp.header.wrongSignature,
    },
    entries: tmp.entries,
  };
};

export default readCreatureBuffer;
