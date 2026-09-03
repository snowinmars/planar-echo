import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';

import Loader from './children/Loader/Loader';

import type { FC } from 'react';
import type { Observable } from 'rxjs';

import type { PrismIndexProgressMessage } from '@planar/shared';

import type { LandingStateStep1, LandingStateStep2, LandingStateStep3, LandingStateStep6 } from '../../store/types';

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

// TODO [snow]: try to reconnect websocket on component load
type Step6Props = Readonly<{
  disabled: boolean;
  loading: LandingStateStep6['step6Loading'];
  gameName: LandingStateStep1['gameName'];
  gameLanguage: LandingStateStep1['gameLanguage'];
  weiduExeDir: LandingStateStep2['weiduExeDir'];
  chitinKeyFile: LandingStateStep3['chitinKeyFile'];
  currentRssBytes: LandingStateStep6['currentRssBytes'];
  progress: LandingStateStep6['progress'];
  biff2json: () => Observable<void>;
}>;
const Step6: FC<Step6Props> = (props: Step6Props) => {
  const { t } = useTranslation();

  const raw2jsonLoaders = [...Object.values(props.progress)].filter(x => x.step.endsWith('raw2json')).filter(x => x.step !== 'effV10_raw2json'); // effv10 has no usage in frontend
  const raw2assetsLoaders = [...Object.values(props.progress)].filter(x => x.step.endsWith('raw2assets'));
  const json2ghostLoaders = [...Object.values(props.progress)].filter(x => x.step.endsWith('json2ghost'));

  return (
    <div>
      <Button
        fullWidth
        onClick={props.biff2json}
        disabled={props.disabled || props.loading}
      >
        {props.currentRssBytes && t('landing.step6.progress', { currentRssMb: Math.round(props.currentRssBytes / (1024 * 1024)) })}
        {!props.currentRssBytes && t('landing.step6.start')}
      </Button>

      <Grid container spacing="1em">
        <Grid size={{ xs: 12 }}>
          <L item={props.progress['buildPrism']} />
          <L item={props.progress['decompileBiffs']} />
        </Grid>

        <Grid size={{ xs: 4 }}>
          {
            raw2jsonLoaders.map(x => (
              <L key={x.step} item={x} />
            ))
          }
        </Grid>

        <Grid size={{ xs: 4 }}>
          {
            raw2assetsLoaders.map(x => (
              <L key={x.step} item={x} />
            ))
          }
        </Grid>

        <Grid size={{ xs: 4 }}>
          {
            json2ghostLoaders.map(x => (
              <L key={x.step} item={x} />
            ))
          }
        </Grid>

        <Grid size={{ xs: 12 }}>
          <L item={props.progress['buildGhost']} />
        </Grid>
      </Grid>
    </div>
  );
};
export default Step6;
