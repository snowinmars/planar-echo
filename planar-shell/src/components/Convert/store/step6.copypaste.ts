import type {
  ProgressStep,
  Progress,
  ProgressSteps,
} from '@planar/shared';

export const getStartingSteps = (): ProgressSteps => ({
  buildPrism: { value: 0, step: 'buildPrism', params: { rssBytes: 0 } },
  decompileBiffs: { value: 0, step: 'decompileBiffs', params: { rssBytes: 0 } },
  tlk_raw2json: { value: 0, step: 'tlk_raw2json', params: { rssBytes: 0, resourceName: '' } },
  ids_raw2json: { value: 0, step: 'ids_raw2json', params: { rssBytes: 0, resourceName: '' } },
  bcs_raw2json: { value: 0, step: 'bcs_raw2json', params: { rssBytes: 0, resourceName: '' } },
  ini_raw2json: { value: 0, step: 'ini_raw2json', params: { rssBytes: 0, resourceName: '' } },
  cre_raw2json: { value: 0, step: 'cre_raw2json', params: { rssBytes: 0, resourceName: '' } },
  dlg_raw2json: { value: 0, step: 'dlg_raw2json', params: { rssBytes: 0, resourceName: '' } },
  effV10_raw2json: { value: 0, step: 'effV10_raw2json', params: { rssBytes: 0, resourceName: '' } },
  effV20_raw2json: { value: 0, step: 'effV20_raw2json', params: { rssBytes: 0, resourceName: '' } },
  itm_raw2json: { value: 0, step: 'itm_raw2json', params: { rssBytes: 0, resourceName: '' } },
  wed_raw2json: { value: 0, step: 'wed_raw2json', params: { rssBytes: 0, resourceName: '' } },
  pvrz_raw2json: { value: 0, step: 'pvrz_raw2json', params: { rssBytes: 0, resourceName: '' } },
  mos_raw2json: { value: 0, step: 'mos_raw2json', params: { rssBytes: 0, resourceName: '' } },
  tis_raw2json: { value: 0, step: 'tis_raw2json', params: { rssBytes: 0, resourceName: '' } },
  bmp_raw2json: { value: 0, step: 'bmp_raw2json', params: { rssBytes: 0, resourceName: '' } },
  bam_raw2json: { value: 0, step: 'bam_raw2json', params: { rssBytes: 0, resourceName: '' } },
  wav_raw2json: { value: 0, step: 'wav_raw2json', params: { rssBytes: 0, resourceName: '' } },
  acm_raw2json: { value: 0, step: 'acm_raw2json', params: { rssBytes: 0, resourceName: '' } },
  mus_raw2json: { value: 0, step: 'mus_raw2json', params: { rssBytes: 0, resourceName: '' } },
  tlk_json2ghost: { value: 0, step: 'tlk_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  ids_json2ghost: { value: 0, step: 'ids_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  bcs_json2ghost: { value: 0, step: 'bcs_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  ini_json2ghost: { value: 0, step: 'ini_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  cre_json2ghost: { value: 0, step: 'cre_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  dlg_json2ghost: { value: 0, step: 'dlg_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  eff_json2ghost: { value: 0, step: 'eff_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  itm_json2ghost: { value: 0, step: 'itm_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  wed_json2ghost: { value: 0, step: 'wed_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  pvrz_json2ghost: { value: 0, step: 'pvrz_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  mos_json2ghost: { value: 0, step: 'mos_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  tis_json2ghost: { value: 0, step: 'tis_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  bmp_json2ghost: { value: 0, step: 'bmp_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  bam_json2ghost: { value: 0, step: 'bam_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  wav_json2ghost: { value: 0, step: 'wav_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  acm_json2ghost: { value: 0, step: 'acm_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  mus_json2ghost: { value: 0, step: 'mus_json2ghost', params: { rssBytes: 0, resourceName: '' } },
  buildGhost: { value: 0, step: 'buildGhost', params: { rssBytes: 0 } },
});

export const getProgressMutation = (data: Progress): ProgressSteps[ProgressStep] => {
  switch (data.step) {
    case 'decompileBiffs':
    case 'buildPrism':
    case 'buildGhost':
    {
      return {
        step: data.step,
        value: data.value,
        params: {
          rssBytes: data.params.rssBytes,
        },
      };
    }
    case 'tlk_raw2json':
    case 'ids_raw2json':
    case 'bcs_raw2json':
    case 'ini_raw2json':
    case 'cre_raw2json':
    case 'dlg_raw2json':
    case 'effV10_raw2json':
    case 'effV20_raw2json':
    case 'itm_raw2json':
    case 'wed_raw2json':
    case 'pvrz_raw2json':
    case 'mos_raw2json':
    case 'tis_raw2json':
    case 'bmp_raw2json':
    case 'bam_raw2json':
    case 'wav_raw2json':
    case 'acm_raw2json':
    case 'mus_raw2json':
    case 'tlk_json2ghost':
    case 'ids_json2ghost':
    case 'bcs_json2ghost':
    case 'ini_json2ghost':
    case 'cre_json2ghost':
    case 'dlg_json2ghost':
    case 'eff_json2ghost':
    case 'itm_json2ghost':
    case 'wed_json2ghost':
    case 'pvrz_json2ghost':
    case 'mos_json2ghost':
    case 'tis_json2ghost':
    case 'bmp_json2ghost':
    case 'bam_json2ghost':
    case 'wav_json2ghost':
    case 'acm_json2ghost':
    case 'mus_json2ghost': {
      return {
        step: data.step,
        value: data.value,
        params: {
          rssBytes: data.params.rssBytes,
          resourceName: data.params.resourceName,
        },
      } as Progress; // TODO [snow]: hot to drop cast?
    }
  }
};
