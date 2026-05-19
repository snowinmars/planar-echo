import type { Ids as IdsPstee } from './pstee/ids/index.js';
import type { Ini as IniPstee } from './pstee/ini/index.js';
import type { Tlk as TlkPstee } from './pstee/tlk/index.js';
import type { CreatureV10 as CreatureV10Pstee, CreatureV11 as CreatureV11Pstee } from './pstee/cre/types.js';
import type { RawDlg as RawDlgPstee } from './pstee/dlg/index.js';
import type { EffectV10 as EffectV10Pstee } from './pstee/eff/v10/parseEffectV10.types.js';
import type { EffectV20 as EffectV20Pstee } from './pstee/eff/v20/parseEffectV20.types.js';
import type { ItmV10 as ItmV10Pstee } from './pstee/itm/types.js';

type EffectPstee = EffectV10Pstee | EffectV20Pstee;
type CreaturePstee = CreatureV10Pstee | CreatureV11Pstee;

export type AllPsteeJsons = Readonly<{
  tlk: TlkPstee;
  ids: Map<string, IdsPstee>;
  inis: Map<string, IniPstee>;
  cres: CreaturePstee[];
  dlgs: RawDlgPstee[];
  effs: EffectPstee[];
  itms: ItmV10Pstee[];
}>;
