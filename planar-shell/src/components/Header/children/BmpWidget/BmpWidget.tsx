import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { isNothing } from '@planar/shared';

import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { bmpWidgetState } from '@/shared/widgets';

import type { FC } from 'react';

import type { WithClassName } from '@/types/fcWithClassName';

import styles from './BmpWidget.module.scss';

/**
 * Fully llm generated, I do not care too much right now
 */

const useBmpWidget = () => useSyncExternalStore(
  bmpWidgetState.subscribe,
  bmpWidgetState.getSnapshot,
);

const Bmps: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, bmps, currentBmpId } = useBmpWidget();
  const actions = bmpWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={bmps}
      value={currentBmpId ?? ''}
      onChange={(_, bmpId) => {
        if (isNothing(bmpId)) throw new Error('Bmp id cannot be empty here');
        navigate(`/bmp/${bmpId}`)?.catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading || !actions}
      slotProps={{ listbox: { component: VirtualizedListbox } }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.bmpLabel', { amount: bmps.length })}
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

const BmpWidget: FC = () => (
  <div className={styles.widget}>
    <Bmps className={styles.bmpPicker} />
  </div>
);

export default BmpWidget;
