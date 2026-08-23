import { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { twodaWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './TwodaWidget.module.scss';

const useTwodaWidget = () => useSyncExternalStore(
  twodaWidgetState.subscribe,
  twodaWidgetState.getSnapshot,
);

const Twodas: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, twodas, currentTwodaId } = useTwodaWidget();
  const actions = twodaWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={twodas}
      value={currentTwodaId ?? ''}
      onChange={(_, twodaId) => {
        if (isNothing(twodaId)) throw new Error('Twoda id cannot be empty here');
        navigate(`/twoda/${twodaId}`)?.catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading || !actions}
      slotProps={{ listbox: { component: VirtualizedListbox } }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.twodaLabel', { amount: twodas.length })}
          variant="standard"
          size="small"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: loading ? <CircularProgress color="inherit" size="1em" /> : null,
            },
          }}
        />
      )}
    />
  );
};

const TwodaWidget: FC = () => (
  <div className={styles.widget}>
    <Twodas className={styles.twodaPicker} />
  </div>
);

export default TwodaWidget;
