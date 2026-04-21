import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Observable } from 'rxjs';
import { useTranslation } from 'react-i18next';
import Loader from './children/Loader/Loader';

import type { FC } from 'react';
import type { LandingStateStep1, LandingStateStep2, LandingStateStep3, LandingStateStep6 } from '../../store/types';
import type { PrismIndexProgressMessage } from '@planar/shared';

type LProps = Readonly<{ item: PrismIndexProgressMessage['data'] }>;
const L: FC<LProps> = ({ item }: LProps) => {
  const { t } = useTranslation();
  const tKey = `landing.step6.${item.step}`;

  return (
    <Loader
      key={item.step}
      value={item.value}
      loading={item.value !== 0 && item.value !== 100}
      variant="percent"
      label={`${t(tKey)} ${item.value}%`}
    />
  );
};

type Step6Props = Readonly<{
  disabled: boolean;
  loading: LandingStateStep6['step6Loading'];
  gameName: LandingStateStep1['gameName'];
  gameLanguage: LandingStateStep1['gameLanguage'];
  weiduExePath: LandingStateStep2['weiduExePath'];
  chitinKeyPath: LandingStateStep3['chitinKeyPath'];
  progress: LandingStateStep6['progress'];
  biff2json: () => Observable<void>;
}>;
const Step6: FC<Step6Props> = (props: Step6Props) => {
  const { t } = useTranslation();

  const raw2jsonLoaders = [...props.progress.values()].filter(x => x.step.endsWith('raw2json')).filter(x => x.step !== 'effV10_raw2json'); // effv10 has no usage in frontend
  const json2ghostLoaders = [...props.progress.values()].filter(x => x.step.endsWith('json2ghost'));

  return (
    <div>
      <Button
        fullWidth
        onClick={props.biff2json}
        loading={props.loading}
        disabled={props.disabled || props.loading}
      >
        {t('landing.step6.start')}
      </Button>

      <Grid container spacing="1em">
        <Grid size={{ xs: 12 }}>
          <L item={props.progress.get('decompileBiffs')!} />
        </Grid>

        <Grid size={{ xs: 6 }}>
          {
            raw2jsonLoaders.map(x => (
              <L key={x.step} item={x} />
            ))
          }
        </Grid>

        <Grid size={{ xs: 6 }}>
          {
            json2ghostLoaders.map(x => (
              <L key={x.step} item={x} />
            ))
          }
        </Grid>

        <Grid size={{ xs: 12 }}>
          <L item={props.progress.get('dlg_json2ghost_compilation')!} />
        </Grid>
      </Grid>
    </div>
  );
};
export default Step6;
