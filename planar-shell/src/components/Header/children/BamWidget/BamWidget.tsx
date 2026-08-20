import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { bamWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './BamWidget.module.scss';

/**
 * Fully llm generated, I do not care too much right now
 */

const useBamWidget = () => useSyncExternalStore(
  bamWidgetState.subscribe,
  bamWidgetState.getSnapshot,
);

const Bams: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const { loading, bams, currentBamId } = useBamWidget();
  const actions = bamWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={bams}
      value={currentBamId ?? ''}
      onChange={(_, bamId) => {
        if (isNothing(bamId)) throw new Error('Bam id cannot be empty here');
        actions?.loadBam(bamId).catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading || !actions}
      slotProps={{ listbox: { component: VirtualizedListbox } }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.bamLabel', { amount: bams.length })}
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

const BamWidget: FC = () => (
  <div className={styles.widget}>
    <Bams className={styles.bamPicker} />
  </div>
);

export default BamWidget;
