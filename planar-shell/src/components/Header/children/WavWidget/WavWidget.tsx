import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { wavWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './WavWidget.module.scss';

/**
 * Fully llm generated, I do not care too much right now
 */

const useWavWidget = () => useSyncExternalStore(
  wavWidgetState.subscribe,
  wavWidgetState.getSnapshot,
);

const Wavs: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const { loading, wavs, currentWavId } = useWavWidget();
  const actions = wavWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={wavs}
      value={currentWavId ?? ''}
      onChange={(_, wavId) => {
        if (isNothing(wavId)) throw new Error('Wav id cannot be empty here');
        actions?.loadWav(wavId).catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading || !actions}
      slotProps={{ listbox: { component: VirtualizedListbox } }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.wavLabel', { amount: wavs.length })}
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

const WavWidget: FC = () => (
  <div className={styles.widget}>
    <Wavs className={styles.wavPicker} />
  </div>
);

export default WavWidget;
