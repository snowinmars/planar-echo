import { useMemo } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Observable } from 'rxjs';
import Loader from './children/Loader/Loader';

import type { FC } from 'react';
import type { LandingStateStep1, LandingStateStep2, LandingStateStep3, LandingStateStep5 } from '../../store/types';
import type { PrismIndexProgressMessage } from '@planar/shared';

type LProps = Readonly<{ item: PrismIndexProgressMessage['data'] }>;
const L: FC<LProps> = ({ item }: LProps) => (
  <Loader
    key={item.step}
    value={item.value}
    loading={item.value !== 0 && item.value !== 100}
    variant="percent"
    label={`${item.step} ${item.value}%`}
  />
);

type ConverterProps = Readonly<{
  disabled: boolean;
  loading: LandingStateStep5['step5Loading'];
  gameName: LandingStateStep1['gameName'];
  gameLanguage: LandingStateStep1['gameLanguage'];
  weiduExePath: LandingStateStep2['weiduExePath'];
  chitinKeyPath: LandingStateStep3['chitinKeyPath'];
  progress: LandingStateStep5['progress'];
  biff2json: () => Observable<void>;
}>;
const Converter: FC<ConverterProps> = (props: ConverterProps) => {
  const loaders = useMemo(
    () => [...props.progress.values()].filter(x => x.step.startsWith('parse')),
    [props.progress], // TODO [snow]: should be bugged because of reference mutation in zustand; fix with reference change instead of mutation
  );

  return (
    <div>
      <Button
        fullWidth
        onClick={props.biff2json}
        loading={props.loading}
        disabled={props.disabled || props.loading}
      >
        I have space on hdd and want to start
      </Button>

      <Grid container spacing="1em">
        <Grid size={{ xs: 12 }}>
          <L item={props.progress.get('decompileBiffs')!} />
        </Grid>

        <Grid size={{ xs: 6 }}>
          {
            loaders.map(x => (
              <L key={x.step} item={x} />
            ))
          }
        </Grid>
      </Grid>
    </div>
  );
};
export default Converter;
