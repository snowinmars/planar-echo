import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { idsWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './IdsWidget.module.scss';

/**
 * Fully llm generated, I do not care too much right now
 */

const useIdsWidget = () => useSyncExternalStore(
  idsWidgetState.subscribe,
  idsWidgetState.getSnapshot,
);

const Idss: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const { loading, idss, currentIdsId } = useIdsWidget();
  const actions = idsWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={idss}
      value={currentIdsId ?? ''}
      onChange={(_, idsId) => {
        if (isNothing(idsId)) throw new Error('Ids id cannot be empty here');
        actions?.loadIds(idsId).catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading || !actions}
      slotProps={{ listbox: { component: VirtualizedListbox } }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.idsLabel', { amount: idss.length })}
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

const IdsWidget: FC = () => (
  <div className={styles.widget}>
    <Idss className={styles.idsPicker} />
  </div>
);

export default IdsWidget;
