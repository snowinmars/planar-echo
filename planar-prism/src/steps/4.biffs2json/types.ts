import type { Ids } from './ids/index.js';
import type { Ini } from './ini/index.js';
import type { Tlk } from './tlk/index.js';
import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from './cre/types.js';
import type { RawDlg } from './dlg/index.js';
import type { EffectV10 } from './eff/v10.types/effectV10.js';
import type { EffectV20 } from './eff/v20.types/effectV20.js';
import type { ItmV10, ItmV11, ItmV20 } from './itm/types.js';

type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;
type Itm = ItmV10 | ItmV11 | ItmV20;
type Effect = EffectV10 | EffectV20;

export type Meta<TSignature, TVersion> = Readonly<{
  signature: TSignature;
  version: TVersion;
  resourceName: string;
  gameName: string;
  ids: Map<string, Ids>;
  isPst: boolean;
  isPstee: boolean;
  isIwd1: boolean;
  isIwd1ee: boolean;
  isIwd2: boolean;
  isIwd2ee: boolean;
  isBg1: boolean;
  isBg1ee: boolean;
  isBg2: boolean;
  isBg2ee: boolean;
  isTobEx: boolean;
  isEe: boolean;
  emptyInt: number;
}>;

export type AllJsons = Readonly<{
  tlk: Tlk;
  ids: Map<string, Ids>;
  inis: Map<string, Ini>;
  cres: Creature[];
  dlgs: RawDlg[];
  effs: Effect[];
  itms: Itm[];
}>;
