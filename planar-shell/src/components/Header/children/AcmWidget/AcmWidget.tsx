import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { isNothing } from '@planar/shared';

import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { acmWidgetState } from '@/shared/widgets';

import type { FC } from 'react';

import type { WithClassName } from '@/types/fcWithClassName';

import styles from './AcmWidget.module.scss';

/**
 * Fully llm generated, I do not care too much right now
 */

const useAcmWidget = () => useSyncExternalStore(
  acmWidgetState.subscribe,
  acmWidgetState.getSnapshot,
);

const Acms: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    loading,
    acms,
    currentAcmId,
  } = useAcmWidget();
  const actions = acmWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={acms}
      value={currentAcmId ?? ''}
      onChange={(_, acmId) => {
        if (isNothing(acmId)) throw new Error('Acm id cannot be empty here');
        navigate(`/acm/${acmId}`)?.catch(e => console.error(e));
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
          label={t('run.acmLabel', { amount: acms.length })}
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

const AcmWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Acms className={styles.acmPicker} />
    </div>
  );
};

export default AcmWidget;
