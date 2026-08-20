type WithResource = Readonly<{
  params: Readonly<{
    resourceName: string;
  }>;
}>;

type Step<T extends ProgressStep> = Readonly<{
  value: number;
  step: T;
  params: Readonly<{
    rssBytes: number;
  }>;
}>;

export const progressSteps = [
  'buildPrism',
  'decompileBiffs',
  'tlk_raw2json',
  'ids_raw2json',
  'bcs_raw2json',
  'ini_raw2json',
  'cre_raw2json',
  'dlg_raw2json',
  'effV10_raw2json',
  'effV20_raw2json',
  'itm_raw2json',
  'wed_raw2json',
  'pvrz_raw2json',
  'mos_raw2json',
  'tis_raw2json',
  'bmp_raw2json',
  'bam_raw2json',
  'wav_raw2json',
  'acm_raw2json',
  'mus_raw2json',
  'tlk_json2ghost',
  'ids_json2ghost',
  'bcs_json2ghost',
  'ini_json2ghost',
  'cre_json2ghost',
  'dlg_json2ghost',
  'eff_json2ghost',
  'itm_json2ghost',
  'wed_json2ghost',
  'pvrz_json2ghost',
  'mos_json2ghost',
  'tis_json2ghost',
  'bmp_json2ghost',
  'bam_json2ghost',
  'wav_json2ghost',
  'acm_json2ghost',
  'mus_json2ghost',
  'buildGhost',
] as const;
export type ProgressStep = typeof progressSteps[number];

/* eslint-disable @stylistic/no-multi-spaces */
type BuildPrismProgress     = Step<'buildPrism'>;
type DecompileBiffsProgress = Step<'decompileBiffs'>;
type TlkRaw2JsonProgress    = Step<'tlk_raw2json'>    & WithResource;
type IdsRaw2JsonProgress    = Step<'ids_raw2json'>    & WithResource;
type BcsRaw2JsonProgress    = Step<'bcs_raw2json'>    & WithResource;
type IniRaw2JsonProgress    = Step<'ini_raw2json'>    & WithResource;
type CreRaw2JsonProgress    = Step<'cre_raw2json'>    & WithResource;
type DlgRaw2JsonProgress    = Step<'dlg_raw2json'>    & WithResource;
type EffV10Raw2JsonProgress = Step<'effV10_raw2json'> & WithResource;
type EffV20Raw2JsonProgress = Step<'effV20_raw2json'> & WithResource;
type ItmRaw2JsonProgress    = Step<'itm_raw2json'>    & WithResource;
type WedRaw2JsonProgress    = Step<'wed_raw2json'>    & WithResource;
type PvrzRaw2JsonProgress   = Step<'pvrz_raw2json'>   & WithResource;
type MosRaw2JsonProgress    = Step<'mos_raw2json'>    & WithResource;
type TisRaw2JsonProgress    = Step<'tis_raw2json'>    & WithResource;
type BmpRaw2JsonProgress    = Step<'bmp_raw2json'>    & WithResource;
type BamRaw2JsonProgress    = Step<'bam_raw2json'>    & WithResource;
type WavRaw2JsonProgress    = Step<'wav_raw2json'>    & WithResource;
type AcmRaw2JsonProgress    = Step<'acm_raw2json'>    & WithResource;
type MusRaw2JsonProgress    = Step<'mus_raw2json'>    & WithResource;
type TlkJson2GhostProgress  = Step<'tlk_json2ghost'>  & WithResource;
type IdsJson2GhostProgress  = Step<'ids_json2ghost'>  & WithResource;
type BcsJson2GhostProgress  = Step<'bcs_json2ghost'>  & WithResource;
type IniJson2GhostProgress  = Step<'ini_json2ghost'>  & WithResource;
type CreJson2GhostProgress  = Step<'cre_json2ghost'>  & WithResource;
type DlgJson2GhostProgress  = Step<'dlg_json2ghost'>  & WithResource;
type EffJson2GhostProgress  = Step<'eff_json2ghost'>  & WithResource;
type ItmJson2GhostProgress  = Step<'itm_json2ghost'>  & WithResource;
type WedJson2GhostProgress  = Step<'wed_json2ghost'>  & WithResource;
type PvrzJson2GhostProgress = Step<'pvrz_json2ghost'> & WithResource;
type MosJson2GhostProgress  = Step<'mos_json2ghost'>  & WithResource;
type TisJson2GhostProgress  = Step<'tis_json2ghost'>  & WithResource;
type BmpJson2GhostProgress  = Step<'bmp_json2ghost'>  & WithResource;
type BamJson2GhostProgress  = Step<'bam_json2ghost'>  & WithResource;
type WavJson2GhostProgress  = Step<'wav_json2ghost'>  & WithResource;
type AcmJson2GhostProgress  = Step<'acm_json2ghost'>  & WithResource;
type MusJson2GhostProgress  = Step<'mus_json2ghost'>  & WithResource;
type BuildGhostProgress     = Step<'buildGhost'>;
/* eslint-enable */

export type Progress
  = | BuildPrismProgress
    | DecompileBiffsProgress
    | TlkRaw2JsonProgress
    | IdsRaw2JsonProgress
    | BcsRaw2JsonProgress
    | IniRaw2JsonProgress
    | CreRaw2JsonProgress
    | DlgRaw2JsonProgress
    | EffV10Raw2JsonProgress
    | EffV20Raw2JsonProgress
    | ItmRaw2JsonProgress
    | WedRaw2JsonProgress
    | PvrzRaw2JsonProgress
    | MosRaw2JsonProgress
    | TisRaw2JsonProgress
    | BmpRaw2JsonProgress
    | BamRaw2JsonProgress
    | WavRaw2JsonProgress
    | AcmRaw2JsonProgress
    | MusRaw2JsonProgress
    | TlkJson2GhostProgress
    | IdsJson2GhostProgress
    | BcsJson2GhostProgress
    | IniJson2GhostProgress
    | CreJson2GhostProgress
    | DlgJson2GhostProgress
    | EffJson2GhostProgress
    | ItmJson2GhostProgress
    | WedJson2GhostProgress
    | PvrzJson2GhostProgress
    | MosJson2GhostProgress
    | TisJson2GhostProgress
    | BmpJson2GhostProgress
    | BamJson2GhostProgress
    | WavJson2GhostProgress
    | AcmJson2GhostProgress
    | MusJson2GhostProgress
    | BuildGhostProgress
;

export type ProgressSteps = {
  buildPrism: BuildPrismProgress;
  decompileBiffs: DecompileBiffsProgress;
  tlk_raw2json: TlkRaw2JsonProgress;
  ids_raw2json: IdsRaw2JsonProgress;
  bcs_raw2json: BcsRaw2JsonProgress;
  ini_raw2json: IniRaw2JsonProgress;
  cre_raw2json: CreRaw2JsonProgress;
  dlg_raw2json: DlgRaw2JsonProgress;
  effV10_raw2json: EffV10Raw2JsonProgress;
  effV20_raw2json: EffV20Raw2JsonProgress;
  itm_raw2json: ItmRaw2JsonProgress;
  wed_raw2json: WedRaw2JsonProgress;
  pvrz_raw2json: PvrzRaw2JsonProgress;
  mos_raw2json: MosRaw2JsonProgress;
  tis_raw2json: TisRaw2JsonProgress;
  bmp_raw2json: BmpRaw2JsonProgress;
  bam_raw2json: BamRaw2JsonProgress;
  wav_raw2json: WavRaw2JsonProgress;
  acm_raw2json: AcmRaw2JsonProgress;
  mus_raw2json: MusRaw2JsonProgress;
  tlk_json2ghost: TlkJson2GhostProgress;
  ids_json2ghost: IdsJson2GhostProgress;
  bcs_json2ghost: BcsJson2GhostProgress;
  ini_json2ghost: IniJson2GhostProgress;
  cre_json2ghost: CreJson2GhostProgress;
  dlg_json2ghost: DlgJson2GhostProgress;
  eff_json2ghost: EffJson2GhostProgress;
  itm_json2ghost: ItmJson2GhostProgress;
  wed_json2ghost: WedJson2GhostProgress;
  pvrz_json2ghost: PvrzJson2GhostProgress;
  mos_json2ghost: MosJson2GhostProgress;
  tis_json2ghost: TisJson2GhostProgress;
  bmp_json2ghost: BmpJson2GhostProgress;
  bam_json2ghost: BamJson2GhostProgress;
  wav_json2ghost: WavJson2GhostProgress;
  acm_json2ghost: AcmJson2GhostProgress;
  mus_json2ghost: MusJson2GhostProgress;
  buildGhost: BuildGhostProgress;
};
