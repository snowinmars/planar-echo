import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { isNothing } from '@planar/shared';

import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { wedWidgetState } from '@/shared/widgets';

import type { FC } from 'react';

import type { WithClassName } from '@/types/fcWithClassName';

import styles from './WedWidget.module.scss';

const useWedWidget = () => useSyncExternalStore(
  wedWidgetState.subscribe,
  wedWidgetState.getSnapshot,
);

const Weds: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    loading,
    weds,
    currentWedId,
  } = useWedWidget();
  const actions = wedWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={weds}
      value={currentWedId ?? ''}
      onChange={(_, wedId) => {
        if (isNothing(wedId)) throw new Error('Wed id cannot be empty here');
        navigate(`/wed/${wedId}`)?.catch(e => console.error(e));
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
          label={t('run.wedLabel', { amount: weds.length })}
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

const WedWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Weds className={styles.wedPicker} />
    </div>
  );
};

export default WedWidget;
