import { useSyncExternalStore } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { creatureWidgetState } from '@/shared/widgets';
import { isNothing } from '@planar/shared';
import { useTranslation } from 'react-i18next';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './CreatureWidget.module.scss';

const useCreatureWidget = () => useSyncExternalStore(
  creatureWidgetState.subscribe,
  creatureWidgetState.getSnapshot,
);

const Creatures: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const {
    loading,
    creatures,
    currentCreatureId,
  } = useCreatureWidget();
  const actions = creatureWidgetState.getActions();

  return (
    <Autocomplete
      className={className}
      options={creatures}
      value={currentCreatureId}
      onChange={(_, creatureId) => {
        if (isNothing(creatureId)) throw new Error('Creature id cannot be empty here');
        actions?.loadCreature(creatureId).catch(e => console.error(e));
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
          label={t('run.creaturesLabel', { amount: creatures.length })}
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

const CreatureWidget: FC = () => {
  return (
    <div className={styles.widget}>
      <Creatures className={styles.creaturePicker} />
    </div>
  );
};

export default CreatureWidget;
