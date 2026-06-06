import { useEffect, useState, useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/components/runners/Dialogue/children/Picker/VirtualizedListbox';
import { dialogueViewState } from '@/shared/widgets/dialogueViewState';
import { getStateIds } from '@/components/runners/Dialogue/store/helpers';
import { isNothing, StateId } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './DialogueWidget.module.scss';

const useDialogueView = () => useSyncExternalStore(
  dialogueViewState.subscribe,
  dialogueViewState.getSnapshot,
);

const Dialogues: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    loading,
    dialogues,
    currentDialogueId,
  } = useDialogueView();
  const actions = dialogueViewState.getActions();

  return (
    <Autocomplete
      className={className}
      options={dialogues}
      value={currentDialogueId}
      onChange={(_, dialogueId) => {
        if (isNothing(dialogueId)) throw new Error('Dialogue id cannot be empty here');
        actions?.setDialogue(dialogueId!).catch(e => console.error(e));
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
          label={t('run.dialoguesLabel', { amount: dialogues.length })}
          variant="standard"
          size="small"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: loading ? <CircularProgress color="inherit" size="1em" /> : null,
            },
            inputLabel: {
              ...params.InputLabelProps,
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
    currentDialogueId,
    currentStateId,
  } = useDialogueView();
  const actions = dialogueViewState.getActions();

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
        actions?.setCurrentStateId(stateId as StateId);
      }}
      loading={loading}
      disabled={loading || !currentDialogueId || !actions}
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
            input: {
              ...params.InputProps,
              endAdornment: loading ? <CircularProgress color="inherit" size="1em" /> : null,
            },
            inputLabel: {
              ...params.InputLabelProps,
            },
          }}
        />
      )}
    >
    </Autocomplete>
  );
};

const DialogueWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Dialogues className={styles.dialoguePicker} />
      <States className={styles.statePicker} />
    </div>
  );
};

export default DialogueWidget;
