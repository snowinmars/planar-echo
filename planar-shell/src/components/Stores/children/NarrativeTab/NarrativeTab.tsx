import { useState, useMemo, FC, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import { Grid } from 'react-window';
import { getZustandNarrative } from '@/engine/store/worldStores';
import { triggerSave } from '@/engine/store/saveSubject';

import type { NumberVariableId, BooleanVariableId } from '@planar/shared';
import type { CellComponentProps } from 'react-window';
import type { ReactElement } from 'react';
import { NumberField } from '../../NumberField';
import { useTranslation } from 'react-i18next';
import { useGridColumns } from '@/hooks/useGridColumns';

import styles from './NarrativeTab.module.scss';

type NarrativeItem = {
  id: string;
  value: number;
  onSave: (key: string, value: number) => void;
};

const ROW_HEIGHT = 48;
const COLUMN_WIDTH = 200;

type GridCellProps = CellComponentProps<Readonly<{ cells: ReadonlyArray<NarrativeItem>; columnCount: number }>>;
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

  // maybe grid can reuse same objects
  useEffect(() => {
    setValue(item.value);
  }, [item.id]);

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

type NarrativeTabProps = Readonly<{
  onSave: () => void;
}>;
const NarrativeTab: FC<NarrativeTabProps> = ({ onSave }: NarrativeTabProps) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');

  const store = getZustandNarrative();

  const keys = useMemo(() => {
    const state = store!.getState();
    const allKeys = Object.keys(state) as (NumberVariableId | BooleanVariableId)[];
    if (!filter) return allKeys;

    const lowercaseFilter = filter.toLowerCase();
    return allKeys.filter(k => k.toLowerCase().includes(lowercaseFilter));
  }, [filter, store]);

  const onCellSave = useCallback((key: string, value: number) => {
    store!.setState({ [key]: value });
    triggerSave();
    onSave();
  }, [store]);

  const cells = useMemo(() => {
    const state = store!.getState();
    return keys.map(key => ({
      id: key,
      value: state[key],
      onSave: onCellSave,
    }));
  }, [keys, store, onCellSave]);

  const { containerRef, columnCount } = useGridColumns({
    columnWidth: COLUMN_WIDTH,
    minColumns: 1,
    gap: 0,
  });

  const rowCount = Math.ceil(cells.length / columnCount);

  return (
    <div ref={containerRef}>
      <TextField
        label={t('stores.tabs.narrative.search', { amount: keys.length })}
        value={filter}
        onChange={e => setFilter(e.target.value)}
        variant="standard"
        fullWidth
        size="small"
      />
      <Grid
        // className does not work on grid
        style={{ height: 600, paddingTop: '1em', marginTop: '1em' }}
        cellComponent={GridCell}
        columnCount={columnCount}
        columnWidth={COLUMN_WIDTH}
        rowCount={rowCount}
        rowHeight={ROW_HEIGHT}
        cellProps={{ cells, columnCount }}
        overscanCount={5}
      />
    </div>
  );
};

export default NarrativeTab;
