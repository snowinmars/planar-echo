import type { GameName } from '../../../shared/types.js';
import type { EffectMeta, EffectV10, EffectV20 } from './readEffectBufferTypes.js';
import createReader from '../../../pipes/readers.js';
import readHeaderV10 from './v10/readHeaderV10.js';
import readHeaderV20 from './v20/readHeaderV20.js';

const v10 = 'v1.0';
const v20 = 'v2.0';

const createMeta = (gameName: GameName, resourceName: string, signature: string, version: string): EffectMeta => {
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
    isv20,
    isEe,
    hasKitIds,
    hasProftypeIds,
    resourceName,
    emptyInt,
  };
};

const detectVersionToUse = (meta: EffectMeta): string => {
  if (meta.signature !== 'eff') throw new Error(`Unsupported signature for item: ${meta.signature}`);
  if (meta.isv10) return v10;
  if (meta.isv20) return v20;
  throw new Error(`Cannot detect version to use for ${JSON.stringify(meta)}`);
};

const readEffectBuffer = (buffer: Buffer, resourceName: string, gameName: GameName): EffectV10 | EffectV20 => {
  const reader = createReader(buffer);

  const signature = reader.string(4);
  const version = reader.string(4);
  const meta = createMeta(gameName, resourceName, signature, version);
  const versionToUse = detectVersionToUse(meta);

  switch (versionToUse) {
    case v10: {
      const header = readHeaderV10(reader, meta);
      const effect: EffectV10 = {
        resourceName,
        header,
      };
      return effect;
    }
    case v20: {
      const header = readHeaderV20(reader, meta);
      const effect: EffectV20 = {
        resourceName,
        header,
      };
      return effect;
    }
    default:throw new Error('Should not happens');
  }
};

export default readEffectBuffer;
