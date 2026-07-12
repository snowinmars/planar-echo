import { useState, useMemo, FC, useEffect, useCallback, useSyncExternalStore, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from 'react-window';
import Autocomplete from '@mui/material/Autocomplete';
import { getZustandCharacter } from '@/engine/store/worldStores';
import { triggerSave } from '@/engine/store/saveSubject';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { NumberField } from '../../NumberField';
import { useGridColumns } from '@/hooks/useGridColumns';
import { listenWorldStoreBroadcast } from '@/engine/store/worldBroadcast';
import { reloadStoresFromDb } from '@/components/runners/Dialogue/children/broadcast';

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
}>>;
const GridCell = ({
  columnIndex,
  rowIndex,
  style,
  cells,
  columnCount,
}: GridCellProps): ReactElement => {
  const flatIndex = rowIndex * columnCount + columnIndex;
  const item = cells[flatIndex];

  const outOfRange = !item || flatIndex >= cells.length;
  if (outOfRange) return <div style={style} className={styles.row} />;

  const [value, setValue] = useState(() => item.value);

  const prevItemRef = useRef(item);
  // grid can reuse same objects
  useEffect(() => {
    if (prevItemRef.current !== item) {
      setValue(item.value);
      prevItemRef.current = item;
    }
  });

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

  const writeStore = getZustandCharacter()!;
  const readState = useSyncExternalStore(writeStore.subscribe, writeStore.getState);

  useEffect(() => {
    const unsubscribe = listenWorldStoreBroadcast(() => {
      reloadStoresFromDb().catch(console.error);
    });
    return () => unsubscribe();
  }, []);

  const characters = useMemo(() => {
    return Object.keys(readState);
  }, [readState]);

  const characterProperties = useMemo(() => {
    if (!readState[characters[0]]) return [];
    return Object.keys(readState[characters[0]]) as Array<keyof CharacterNarrativeProps>;
  }, [readState, characters]);

  const onCellSave = useCallback((field: string, value: number | string) => {
    if (!selectedCharacter) return;
    const current = readState[selectedCharacter];

    writeStore.setState({ [selectedCharacter]: { ...current, [field]: value } });
    triggerSave();
    onSave();
  }, [writeStore, selectedCharacter, readState]);

  const characterPropertyCells = useMemo(() => {
    if (!selectedCharacter) return [];
    const character = readState[selectedCharacter];
    if (!character) return [];

    return characterProperties.map(id => ({
      id,
      value: character[id],
      onSave: onCellSave,
    }));
  }, [readState, selectedCharacter, onCellSave, characterProperties]);

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
