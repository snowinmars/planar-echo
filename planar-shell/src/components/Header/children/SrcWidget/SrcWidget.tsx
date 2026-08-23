import { useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { srcWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './SrcWidget.module.scss';

const useSrcWidget = () => useSyncExternalStore(
  srcWidgetState.subscribe,
  srcWidgetState.getSnapshot,
);

const Srcs: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, srcs, currentSrcId } = useSrcWidget();
  const actions = srcWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={srcs}
      value={currentSrcId ?? ''}
      onChange={(_, srcId) => {
        if (isNothing(srcId)) throw new Error('Src id cannot be empty here');
        navigate(`/src/${srcId}`)?.catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading || !actions}
      slotProps={{ listbox: { component: VirtualizedListbox } }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.srcLabel', { amount: srcs.length })}
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

const SrcWidget: FC = () => (
  <div className={styles.widget}>
    <Srcs className={styles.srcPicker} />
  </div>
);

export default SrcWidget;
