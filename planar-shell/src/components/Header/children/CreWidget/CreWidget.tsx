import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { creWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './CreWidget.module.scss';

const useCreWidget = () => useSyncExternalStore(
  creWidgetState.subscribe,
  creWidgetState.getSnapshot,
);

const Cres: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    loading,
    cres,
    currentCreId,
  } = useCreWidget();
  const actions = creWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={cres}
      value={currentCreId ?? ''}
      onChange={(_, creId) => {
        if (isNothing(creId)) throw new Error('Cre id cannot be empty here');
        actions?.loadCre(creId).catch(e => console.error(e));
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
          label={t('run.cresLabel', { amount: cres.length })}
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

const CreWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Cres className={styles.crePicker} />
    </div>
  );
};

export default CreWidget;
