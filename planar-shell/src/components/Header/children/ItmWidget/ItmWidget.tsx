import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { itmWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './ItmWidget.module.scss';

const useItmWidget = () => useSyncExternalStore(
  itmWidgetState.subscribe,
  itmWidgetState.getSnapshot,
);

const Itms: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    loading,
    itms,
    currentItmId,
  } = useItmWidget();
  const actions = itmWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={itms}
      value={currentItmId ?? ''}
      onChange={(_, itmId) => {
        if (isNothing(itmId)) throw new Error('Itm id cannot be empty here');
        actions?.loadItm(itmId).catch(e => console.error(e));
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
          label={t('run.itmsLabel', { amount: itms.length })}
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

const ItmWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Itms className={styles.itmPicker} />
    </div>
  );
};

export default ItmWidget;
