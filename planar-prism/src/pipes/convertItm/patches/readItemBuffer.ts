import createReader from '../../../pipes/readers.js';
import readHeaderV10 from './readHeaderV10.js';
import readHeaderV11 from './readHeaderV11.js';
import readHeaderV20 from './readHeaderV20.js';
import readExtendedHeaderV20 from './readExtendedHeaderV20.js';
import readFeatureBlockV20 from './readFeatureBlockV20.js';
import readExtendedHeaderV11 from './readExtendedHeaderV11.js';
import readFeatureBlockV11 from './readFeatureBlockV11.js';
import readFeatureBlockV10 from './readFeatureBlockV10.js';
import readExtendedHeaderV10 from './readExtendedHeaderV10.js';
import type { GameName } from '../../../shared/types.js';
import type { ItemMeta } from './readItemBufferTypes.js';
import type { ItemExtendedHeaderV20 } from './readExtendedHeaderTypesV20.js';
import type { ItemFeatureBlockV20 } from './readFeatureBlockTypesV20.js';
import type { ItemExtendedHeaderV11 } from './readExtendedHeaderTypesV11.js';
import type { ItemFeatureBlockV11 } from './readFeatureBlockTypesV11.js';
import type { ItemFeatureBlockV10 } from './readFeatureBlockTypesV10.js';
import type { ItemExtendedHeaderV10 } from './readExtendedHeaderTypesV10.js';
import type { ItemV10, ItemV11, ItemV20 } from './readItemBufferTypes.js';

const v10 = 'v1';
const v11 = 'v1.1';
const v20 = 'v2.0';

const createMeta = (gameName: GameName, resourceName: string, signature: string, version: string): ItemMeta => {
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
  const isv20          = version === v20;
  const hasKitIds      = false;
  const hasProftypeIds = false;
  const emptyInt       = 4294967295;
  /* eslint-enable */

  return {
    signature,
    version,
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
    isv20,
    isEe,
    hasKitIds,
    hasProftypeIds,
    resourceName,
    emptyInt,
  };
};

const detectVersionToUse = (meta: ItemMeta): string => {
  if (meta.isv11 || (meta.isv10 && meta.isPstee)) return v11;
  if (meta.isv10) return v10;
  if (meta.isv20) return v20;
  throw new Error(`Cannot detect version to use for ${JSON.stringify(meta)}`);
};

const readItemBuffer = (buffer: Buffer, resourceName: string, gameName: GameName): ItemV10 | ItemV11 | ItemV20 => {
  const reader = createReader(buffer);

  const signature = reader.string(4);
  if (signature !== 'itm') throw new Error(`Unsupported signature: ${signature}`);

  const version = reader.string(4);
  if (version !== v10 && version !== v11 && version !== v20) throw new Error(`Unsupported version: ${version}`);

  const meta = createMeta(gameName, resourceName, signature, version);

  const versionToUse = detectVersionToUse(meta);

  switch (versionToUse) {
    case v10: {
      // const headerSize = 114;
      const extendedHeaderSize = 56;
      const featureBlockSize = 48;

      const header = readHeaderV10(reader, meta);

      const extendedHeaders: ItemExtendedHeaderV10[] = [];
      for (let i = 0; i < header.countOfExtendedHeaders; i++) {
        const offset = header.offsetToExtendedHeaders + i * extendedHeaderSize;
        const extendedHeader = readExtendedHeaderV10(reader.fork(offset), meta);
        extendedHeaders.push(extendedHeader);

        for (let j = 0; j < extendedHeader.countOfFeatureBlocks; j++) {
          const offset = header.offsetToFeatureBlocks + extendedHeader.indexIntoFeatureBlocks * featureBlockSize;
          const extendedHeaderFeatureBlock = readFeatureBlockV10(reader.fork(offset), meta);
          extendedHeader.featureBlocks.push(extendedHeaderFeatureBlock);
        }
      }

      const featureBlocks: ItemFeatureBlockV10[] = [];
      for (let i = 0; i < header.countOfEquippingFeatureBlocks; i++) {
        const offset = header.offsetToFeatureBlocks + i * featureBlockSize;
        const featureBlock = readFeatureBlockV10(reader.fork(offset), meta);
        featureBlocks.push(featureBlock);
      }

      const item: ItemV10 = {
        resourceName,
        header,
        extendedHeaders,
        featureBlocks,
      };
      return item;
    }
    case v11: {
      // const headerSize = 114;
      const extendedHeaderSize = 56;
      const featureBlockSize = 48;

      const header = readHeaderV11(reader, meta);

      const extendedHeaders: ItemExtendedHeaderV11[] = [];
      for (let i = 0; i < header.countOfExtendedHeaders; i++) {
        const offset = header.offsetToExtendedHeaders + i * extendedHeaderSize;
        const extendedHeader = readExtendedHeaderV11(reader.fork(offset), meta);
        extendedHeaders.push(extendedHeader);

        for (let j = 0; j < extendedHeader.countOfFeatureBlocks; j++) {
          const offset = header.offsetToFeatureBlocks + extendedHeader.indexIntoFeatureBlocks * featureBlockSize;
          const extendedHeaderFeatureBlock = readFeatureBlockV11(reader.fork(offset), meta);
          extendedHeader.featureBlocks.push(extendedHeaderFeatureBlock);
        }
      }

      const featureBlocks: ItemFeatureBlockV11[] = [];
      for (let i = 0; i < header.countOfEquippingFeatureBlocks; i++) {
        const offset = header.offsetToFeatureBlocks + i * featureBlockSize;
        const featureBlock = readFeatureBlockV11(reader.fork(offset), meta);
        featureBlocks.push(featureBlock);
      }

      const item: ItemV11 = {
        resourceName,
        header,
        extendedHeaders,
        featureBlocks,
      };
      return item;
    }
    case v20: {
      // const headerSize = 114;
      const extendedHeaderSize = 56;
      const featureBlockSize = 48;

      const header = readHeaderV20(reader, meta);

      const extendedHeaders: ItemExtendedHeaderV20[] = [];
      for (let i = 0; i < header.countOfExtendedHeaders; i++) {
        const offset = header.offsetToExtendedHeaders + i * extendedHeaderSize;
        const extendedHeader = readExtendedHeaderV20(reader.fork(offset), meta);
        extendedHeaders.push(extendedHeader);

        for (let j = 0; j < extendedHeader.countOfFeatureBlocks; j++) {
          const offset = header.offsetToFeatureBlocks + extendedHeader.indexIntoFeatureBlocks * featureBlockSize;
          const extendedHeaderFeatureBlock = readFeatureBlockV20(reader.fork(offset), meta);
          extendedHeader.featureBlocks.push(extendedHeaderFeatureBlock);
        }
      }

      const featureBlocks: ItemFeatureBlockV20[] = [];
      for (let i = 0; i < header.countOfEquippingFeatureBlocks; i++) {
        const offset = header.offsetToFeatureBlocks + i * featureBlockSize;
        const featureBlock = readFeatureBlockV20(reader.fork(offset), meta);
        featureBlocks.push(featureBlock);
      }

      const item: ItemV20 = {
        resourceName,
        header,
        extendedHeaders,
        featureBlocks,
      };
      return item;
    }
    default:throw new Error(`Unsupported version: ${version}`);
  }
};

export default readItemBuffer;
