import createReader from '../../../pipes/readers.js';
import type { GameName, PartialWriteable } from '../../../shared/types.js';
import type { CreatureMeta, CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from './readCreatureBufferTypes.js';
import readHeaderV10 from './v10/readHeaderV10.js';
import readKnownSpellsV10 from './v10/readKnownSpellsV10.js';
import readSpellMemorizationInfosV10 from './v10/readSpellMemorizationInfoV10.js';
import readMemorizedSpellsTableV10 from './v10/readMemorizedSpellsTableV10.js';
import readCreatureItemsV10 from './v10/readItemsTableV10.js';
import readEffects1V10 from './v10/readEffects1V10.js';
import readItemSlotsV10 from './v10/readtemSlotsV10.js';
import readEffects2V10 from './v10/readEffects2V10.js';
import type { Ids } from 'src/pipes/convertIds/patches/readIdsBufferTypes.js';

const v10 = 'v1.0';
const v11 = 'v1.1';
const v12 = 'v1.2';
const v22 = 'v2.2';
const v90 = 'v9.0';

const createMeta = (gameName: GameName, resourceName: string, signature: string, version: string, ids: Ids[]): CreatureMeta => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const isPstee        = gameName === 'pstee';
  const isPst          = true;
  const isIwd          = false;
  const isIwd2         = false;
  const isBg           = false;
  const isBgee         = false;
  const isBg2          = false;
  const isBg2ee        = false;
  const isTobEx        = false;
  const isEe           = gameName === 'pstee'; // TODO [snow]: or other ee games
  const isv10          = version === v10;
  const isv11          = version === v11;
  const isv12          = version === v12;
  const isv22          = version === v22;
  const isv90          = version === v90;
  const hasKitIds      = false;
  const hasProftypeIds = false;
  const emptyInt       = 4294967295;
  /* eslint-enable */

  const idsMap = new Map<string, Ids>();
  for (const id of ids) {
    idsMap.set(id.resourceName, id);
  }

  return {
    signature,
    version,
    idsMap: idsMap,
    gameName,
    resourceName,
    isPst,
    isPstee,
    isBg,
    isBgee,
    isBg2,
    isBg2ee,
    isIwd,
    isIwd2,
    isTobEx,
    isv10,
    isv11,
    isv12,
    isv22,
    isv90,
    isEe,
    hasKitIds,
    hasProftypeIds,
    emptyInt,
  };
};

const detectVersionToUse = (meta: CreatureMeta): string => {
  if (meta.signature !== 'cre') throw new Error(`Unsupported signature for creature: ${meta.signature}`);
  if (meta.isv10) return v10;
  if (meta.isv11) return v11;
  if (meta.isv12) return v12;
  if (meta.isv22) return v22;
  if (meta.isv90) return v90;
  throw new Error(`Cannot detect version to use for ${JSON.stringify(meta)}`);
};

const readCreatureBuffer = (buffer: Buffer, resourceName: string, gameName: GameName, ids: Ids[]): CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90 => {
  const reader = createReader(buffer);

  const signature = reader.string(4);
  const version = reader.string(4);
  const meta = createMeta(gameName, resourceName, signature, version, ids);
  const versionToUse = detectVersionToUse(meta);

  switch (versionToUse) {
    case v10: {
      const tmp: PartialWriteable<CreatureV10> = {};

      tmp.header = readHeaderV10(reader, meta);
      tmp.knownSpells = readKnownSpellsV10(reader, tmp.header, meta);
      tmp.spellMemorizationInfos = readSpellMemorizationInfosV10(reader, tmp.header, meta);
      tmp.memorizedSpellsTable = readMemorizedSpellsTableV10(reader, tmp.header, meta);
      if (tmp.header.effStructureVersion === 0) {
        tmp.effects = readEffects1V10(reader, tmp.header, meta);
      }
      else if (tmp.header.effStructureVersion === 1) {
        tmp.effects = readEffects2V10(reader, tmp.header, meta);
      }
      else {
        throw new Error(`Unknown effect structure version '${tmp.header.effStructureVersion}' for creature '${meta.resourceName}'`);
      }

      tmp.itemsTable = readCreatureItemsV10(reader, tmp.header, meta);

      tmp.itemSlots = readItemSlotsV10(reader, tmp.header, meta);

      return {
        resourceName,
        header: tmp.header,
        knownSpells: tmp.knownSpells,
        spellMemorizationInfos: tmp.spellMemorizationInfos,
        memorizedSpellsTable: tmp.memorizedSpellsTable,
        effects: tmp.effects,
        itemsTable: tmp.itemsTable,
        itemSlots: tmp.itemSlots,
      };
    }
    case v11: {
      break;
    }
    case v12: {
      break;
    }
    case v22: {
      break;
    }
    case v90: {
      break;
    }
    default: {
      throw new Error('Should not happens');
    }
  }
  // @ts-ignore
  return null; // TODO [snow]: replace with throw when all the versions are done
  // throw new Error('Should not happens');
};

export default readCreatureBuffer;
