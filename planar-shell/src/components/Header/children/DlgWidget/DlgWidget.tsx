import { useEffect, useState, useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { dlgWidgetState } from '@/shared/widgets';
import { getStateIds } from '@/components/runners/Dlg/store/helpers';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { StateId } from '@planar/shared';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './DlgWidget.module.scss';

const useDlgWidget = () => useSyncExternalStore(
  dlgWidgetState.subscribe,
  dlgWidgetState.getSnapshot,
);

const Dlgs: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    loading,
    dlgs,
    currentDlgId,
  } = useDlgWidget();
  const actions = dlgWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={dlgs}
      value={currentDlgId ?? ''}
      onChange={(_, dlgId) => {
        if (isNothing(dlgId)) throw new Error('Dlg id cannot be empty here');
        if (actions) actions.loadDlg(dlgId).catch(e => console.error(e));
        else console.warn('Widget is not working properly: no actions were found');
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
          label={t('run.dlgsLabel', { amount: dlgs.length })}
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

const States: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    tree,
    loading,
    currentDlgId,
    currentStateId,
  } = useDlgWidget();
  const actions = dlgWidgetState.getActions();

  const [stateIds, setStateIds] = useState<StateId[]>([]);
  useEffect(() => {
    setStateIds(getStateIds(tree));
  }, [tree]);

  return (
    <Autocomplete
      className={className}
      options={stateIds}
      value={currentStateId ?? ''}
      onChange={(_, stateId) => {
        if (!stateId) throw new Error('State id cannot be empty here');
        if (actions) actions.setCurrentStateId(stateId as StateId);
        else console.warn('Widget is not working properly: no actions were found');
      }}
      loading={loading}
      disabled={loading || !currentDlgId || !actions}
      slotProps={{
        listbox: {
          component: VirtualizedListbox,
        },
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.statesLabel', { amount: stateIds.length })}
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

const DlgWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Dlgs className={styles.dlgPicker} />
      <States className={styles.statePicker} />
    </div>
  );
};

export default DlgWidget;
