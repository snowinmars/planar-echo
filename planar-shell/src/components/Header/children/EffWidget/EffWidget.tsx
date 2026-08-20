import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { effWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './EffWidget.module.scss';

/**
 * Fully llm generated, I do not care too much right now
 */

const useEffWidget = () => useSyncExternalStore(
  effWidgetState.subscribe,
  effWidgetState.getSnapshot,
);

const Effs: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const { loading, effs, currentEffId } = useEffWidget();
  const actions = effWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={effs}
      value={currentEffId ?? ''}
      onChange={(_, effId) => {
        if (isNothing(effId)) throw new Error('Eff id cannot be empty here');
        actions?.loadEff(effId).catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading || !actions}
      slotProps={{ listbox: { component: VirtualizedListbox } }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.effLabel', { amount: effs.length })}
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

const EffWidget: FC = () => (
  <div className={styles.widget}>
    <Effs className={styles.effPicker} />
  </div>
);

export default EffWidget;
