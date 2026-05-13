import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from './VirtualizedListbox';
import { useShallow } from 'zustand/react/shallow';
import { isNothing, StateId } from '@planar/shared';
import { useDialogueStore } from '../../store/dialogueStore';
import { getStateIds } from '../../store/helpers';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './Picker.module.scss';

const Dialogues: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();

  const {
    loading,
    dialogues,
    currentDialogueId,
    setDialogue,
  } = useDialogueStore(useShallow(state => ({
    loading: state.loading,
    dialogues: state.dialogues,
    currentDialogueId: state.currentDialogueId,
    setDialogue: state.setDialogue,
  })));

  return (
    <Autocomplete
      className={className}
      options={dialogues}
      value={currentDialogueId}
      onChange={(_, dialogueId) => {
        if (isNothing(dialogueId)) throw new Error('Dialogue id cannot be empty here');
        setDialogue(dialogueId!).catch(e => console.error(e));
      }}
      loading={loading}
      disabled={loading}
      slotProps={{
        listbox: {
          component: VirtualizedListbox,
        },
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.dialoguesLabel', { amount: dialogues.length })}
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
    setCurrentStateId,
  } = useDialogueStore(useShallow(state => ({
    tree: state.tree,
    loading: state.loading,
    currentDialogueId: state.currentDialogueId,
    currentStateId: state.currentStateId,
    setCurrentStateId: state.setCurrentStateId,
  })));

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
        setCurrentStateId(stateId as StateId);
      }}
      loading={loading}
      disabled={loading || !currentDialogueId}
      slotProps={{
        listbox: {
          component: VirtualizedListbox,
        },
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={t('run.statesLabel', { amount: stateIds.length })}
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

const Picker: FC = () => {
  const loadDialogues = useDialogueStore(state => state.loadDialogues);

  useEffect(() => {
    loadDialogues()
      .catch(e => console.error(e));
  }, []);

  return (
    <div className={styles.picker}>
      <Dialogues className={styles.dialoguePicker} />
      <States className={styles.statePicker} />
    </div>
  );
};

export default Picker;
