import type { GameName } from '../1.createPathes/types.js';
import type { Ids } from './ids/index.js';
import type { Meta } from './types.js';

type CreateMetaProps<TSignature, TVersion> = Readonly<{
  signature: TSignature;
  version: TVersion;
  resourceName: string;
  gameName: GameName;
  ids: Map<string, Ids>;
}>;
const createMeta = <TSignature, TVersion>(props: CreateMetaProps<TSignature, TVersion>): Meta<TSignature, TVersion> => {
  return {
    signature: props.signature,
    version: props.version,
    resourceName: props.resourceName,
    gameName: props.gameName,
    ids: props.ids,
    isPst: props.gameName === 'pst',
    isPstee: props.gameName === 'pstee',
    isIwd1: props.gameName === 'iwd',
    isIwd1ee: props.gameName === 'iwdee',
    isIwd2: props.gameName === 'iwd2',
    isIwd2ee: props.gameName === 'iwd2ee',
    isBg1: props.gameName === 'bg1',
    isBg1ee: props.gameName === 'bg1ee',
    isBg2: props.gameName === 'bg2',
    isBg2ee: props.gameName === 'bg2ee',
    isTobEx: false, // TODO [snow]: how to calculate?
    isEe: props.gameName === 'pstee' || props.gameName === 'iwdee' || props.gameName === 'iwd2ee' || props.gameName === 'bg1ee' || props.gameName === 'bg2ee',
    emptyInt: 4294967295,
  };
};

export default createMeta;
