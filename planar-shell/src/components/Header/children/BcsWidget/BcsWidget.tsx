import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { bcsWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './BcsWidget.module.scss';

const useBcsWidget = () => useSyncExternalStore(
  bcsWidgetState.subscribe,
  bcsWidgetState.getSnapshot,
);

const Bcss: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    loading,
    bcss,
    currentBcsId,
  } = useBcsWidget();
  const actions = bcsWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={bcss}
      value={currentBcsId ?? ''}
      onChange={(_, bcsId) => {
        if (isNothing(bcsId)) throw new Error('Bcs id cannot be empty here');
        actions?.loadBcs(bcsId).catch(e => console.error(e));
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
          label={t('run.bcsLabel', { amount: bcss.length })}
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

const BcsWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Bcss className={styles.bcsPicker} />
    </div>
  );
};

export default BcsWidget;
