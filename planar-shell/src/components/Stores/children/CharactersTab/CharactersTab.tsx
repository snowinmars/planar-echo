import { useState, useMemo, FC, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from 'react-window';
import Autocomplete from '@mui/material/Autocomplete';
import { getZustandCharacter } from '@/engine/store/worldStores';
import { triggerSave } from '@/engine/store/saveSubject';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { NumberField } from '../../NumberField';
import { useGridColumns } from '@/hooks/useGridColumns';

import type { CharacterNarrativeProps } from '@/engine/constructors/types';
import type { CellComponentProps } from 'react-window';
import type { ReactElement } from 'react';

import styles from './CharactersTab.module.scss';
import { WhoId } from '@planar/shared';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

type QuickPick = Readonly<{
  id: WhoId;
  getName: (t: TFunction<'translation', undefined>) => string;
}>;
const QUICK_PICKS: QuickPick[] = [
  { id: 'nameless', getName: t => t('stores.tabs.characters.namelessOne') },
  { id: 'morte', getName: t => t('stores.tabs.characters.morte') },
  { id: 'annah', getName: t => t('stores.tabs.characters.annah') },
  { id: 'dakkon', getName: t => t('stores.tabs.characters.dakkon') },
  { id: 'grace', getName: t => t('stores.tabs.characters.grace') },
  { id: 'nordom', getName: t => t('stores.tabs.characters.nordom') },
  { id: 'ignus', getName: t => t('stores.tabs.characters.ignus') },
  { id: 'vhailor', getName: t => t('stores.tabs.characters.vhailor') },
  { id: 'deions', getName: t => t('stores.tabs.characters.deionarra') },
  { id: 'ravel', getName: t => t('stores.tabs.characters.ravel') },
] as const;

const ROW_HEIGHT = 48;
const COLUMN_WIDTH = 200;

type CharacterItem = {
  id: keyof CharacterNarrativeProps;
  value: number | string;
  onSave: (field: string, value: number | string) => void;
};

type GridCellProps = CellComponentProps<Readonly<{
  cells: ReadonlyArray<CharacterItem>;
  columnCount: number;
  selectedCharacter: string; }>>;
const GridCell = ({
  columnIndex,
  rowIndex,
  style,
  cells,
  columnCount,
  selectedCharacter,
}: GridCellProps): ReactElement => {
  const flatIndex = rowIndex * columnCount + columnIndex;
  const item = cells[flatIndex];
  const [value, setValue] = useState(() => item.value);

  // maybe grid can reuse same objects
  useEffect(() => {
    setValue(item.value);
  }, [item.id, selectedCharacter]);

  const outOfRange = !item || flatIndex >= cells.length;
  if (outOfRange) return <div style={style} className={styles.row} />;

  if (typeof value === 'string') {
    return (
      <div style={style} className={styles.row}>
        <TextField
          className={styles.input}
          size="small"
          value={value}
          label={item.id}
          variant="outlined"
          onChange={(e) => {
            const newValue = e.target.value ?? '';
            setValue(newValue);
            item.onSave(item.id, newValue);
          }}
        >
        </TextField>
      </div>
    );
  }

  return (
    <div style={style} className={styles.row}>
      <NumberField
        size="small"
        label={item.id}
        value={value}
        onValueChange={(x) => {
          const newValue = x ?? 0;
          setValue(newValue);
          item.onSave(item.id, newValue);
        }}
      />
    </div>
  );
};

type CharactersTabProps = Readonly<{
  onSave: () => void;
}>;
const CharactersTab: FC<CharactersTabProps> = ({ onSave }: CharactersTabProps) => {
  const { t } = useTranslation();
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const store = getZustandCharacter();

  const characters = useMemo(() => {
    if (!store) return [];
    return Object.keys(store.getState());
  }, [store]);

  const characterProperties = useMemo(() => {
    const anyCharacter = store!.getState()[characters[0]];
    return Object.keys(anyCharacter) as Array<keyof CharacterNarrativeProps>;
  }, [store, characters]);

  const onCellSave = useCallback((field: string, value: number | string) => {
    if (!selectedCharacter) return;
    const current = store!.getState()[selectedCharacter];

    store!.setState({ [selectedCharacter]: { ...current, [field]: value } });
    triggerSave();
    onSave();
  }, [store, selectedCharacter]);

  const characterPropertyCells = useMemo(() => {
    if (!selectedCharacter) return [];
    const character = store!.getState()[selectedCharacter];
    if (!character) return [];

    return characterProperties.map(id => ({
      id,
      value: character[id],
      onSave: onCellSave,
    }));
  }, [store, selectedCharacter, onCellSave, characterProperties]);

  const { containerRef, columnCount } = useGridColumns({
    columnWidth: COLUMN_WIDTH,
    minColumns: 1,
    gap: 0,
  });

  const rowCount = Math.ceil(characterPropertyCells.length / columnCount);

  return (
    <div>
      <Autocomplete
        className={styles.search}
        options={characters}
        value={selectedCharacter}
        onChange={(_, value) => setSelectedCharacter(value)}
        renderInput={params => (
          <TextField
            {...params}
            label={t('stores.tabs.characters.search', { amount: characters.length })}
            variant="standard"
            size="small"
          />
        )}
        slotProps={{
          listbox: { component: VirtualizedListbox },
        }}
      />

      <div className={styles.quickpicks}>
        {QUICK_PICKS.map(pick => (
          <Button
            className={styles.quickpick}
            size="small"
            key={pick.id}
            variant={selectedCharacter === pick.id ? 'contained' : 'outlined'}
            onClick={() => setSelectedCharacter(pick.id)}
          >
            {pick.getName(t)}
          </Button>
        ))}
      </div>

      <div ref={containerRef}>
        {selectedCharacter && (
          <Grid
            // className does not work on grid
            style={{ height: 600, paddingTop: '1em', marginTop: '1em' }}
            cellComponent={GridCell}
            columnCount={columnCount}
            columnWidth={COLUMN_WIDTH}
            rowCount={rowCount}
            rowHeight={ROW_HEIGHT}
            cellProps={{ cells: characterPropertyCells, columnCount, selectedCharacter }}
            overscanCount={5}
          />
        )}
      </div>
    </div>
  );
};

export default CharactersTab;
