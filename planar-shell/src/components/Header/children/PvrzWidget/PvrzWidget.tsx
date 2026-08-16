import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { pvrzWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './PvrzWidget.module.scss';

const usePvrzWidget = () => useSyncExternalStore(
  pvrzWidgetState.subscribe,
  pvrzWidgetState.getSnapshot,
);

const Pvrzs: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    loading,
    pvrzs,
    currentPvrzId,
  } = usePvrzWidget();
  const actions = pvrzWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={pvrzs}
      value={currentPvrzId ?? ''}
      onChange={(_, pvrzId) => {
        if (isNothing(pvrzId)) throw new Error('Pvrz id cannot be empty here');
        actions?.loadPvrz(pvrzId).catch(e => console.error(e));
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
          label={t('run.pvrzLabel', { amount: pvrzs.length })}
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

const PvrzWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Pvrzs className={styles.pvrzPicker} />
    </div>
  );
};

export default PvrzWidget;
