import { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { musWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './MusWidget.module.scss';

/**
 * Fully llm generated, I do not care too much right now
 */

const useMusWidget = () => useSyncExternalStore(
  musWidgetState.subscribe,
  musWidgetState.getSnapshot,
);

const Muss: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, muss, currentMusId } = useMusWidget();
  const actions = musWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={muss}
      value={currentMusId ?? ''}
      onChange={(_, musId) => {
        if (isNothing(musId)) throw new Error('Mus id cannot be empty here');
        navigate(`/mus/${musId}`)?.catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading || !actions}
      slotProps={{ listbox: { component: VirtualizedListbox } }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.musLabel', { amount: muss.length })}
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

const MusWidget: FC = () => (
  <div className={styles.widget}>
    <Muss className={styles.musPicker} />
  </div>
);

export default MusWidget;
