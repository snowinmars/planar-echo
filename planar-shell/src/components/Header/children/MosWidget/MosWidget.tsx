import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { isNothing } from '@planar/shared';

import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { mosWidgetState } from '@/shared/widgets';

import type { FC } from 'react';

import type { WithClassName } from '@/types/fcWithClassName';

import styles from './MosWidget.module.scss';

const useMosWidget = () => useSyncExternalStore(
  mosWidgetState.subscribe,
  mosWidgetState.getSnapshot,
);

const Moss: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    loading,
    moss,
    currentMosId,
  } = useMosWidget();
  const actions = mosWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={moss}
      value={currentMosId ?? ''}
      onChange={(_, mosId) => {
        if (isNothing(mosId)) throw new Error('Mos id cannot be empty here');
        navigate(`/mos/${mosId}`)?.catch(e => console.error(e));
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
          label={t('run.mosLabel', { amount: moss.length })}
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

const MosWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Moss className={styles.mosPicker} />
    </div>
  );
};

export default MosWidget;
