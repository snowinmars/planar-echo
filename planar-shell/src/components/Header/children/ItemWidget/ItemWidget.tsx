import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { itemWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './ItemWidget.module.scss';

const useItemWidget = () => useSyncExternalStore(
  itemWidgetState.subscribe,
  itemWidgetState.getSnapshot,
);

const Items: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    loading,
    items,
    currentItemId,
  } = useItemWidget();
  const actions = itemWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={items}
      value={currentItemId}
      onChange={(_, itemId) => {
        if (isNothing(itemId)) throw new Error('Item id cannot be empty here');
        actions?.loadItem(itemId!).catch(e => console.error(e));
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
          label={t('run.itemsLabel', { amount: items.length })}
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

const ItemWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Items className={styles.itemPicker} />
    </div>
  );
};

export default ItemWidget;
