import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { tisWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './TisWidget.module.scss';

const useTisWidget = () => useSyncExternalStore(
  tisWidgetState.subscribe,
  tisWidgetState.getSnapshot,
);

const Tiss: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    loading,
    tiss,
    currentTisId,
  } = useTisWidget();
  const actions = tisWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={tiss}
      value={currentTisId ?? ''}
      onChange={(_, tisId) => {
        if (isNothing(tisId)) throw new Error('Tis id cannot be empty here');
        actions?.loadTis(tisId).catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading || !actions}
      slotProps={{
        listbox: {
          component: VirtualizedListbox,
        },
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.tisLabel', { amount: tiss.length })}
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
    >
    </Autocomplete>
  );
};

const TisWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Tiss className={styles.tisPicker} />
    </div>
  );
};

export default TisWidget;
