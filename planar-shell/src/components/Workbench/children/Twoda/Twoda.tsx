import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';
import { useTwodaStore } from './store/twodaStore';
import { useTwodaWidgetBridge } from './useTwodaWidgetBridge';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Twoda: FC = () => {
  useTwodaWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'twoda');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentTwoda,
    loadTwoda,
    disposeTwoda,
  } = useTwodaStore(useShallow(state => ({
    loading: state.loading,
    currentTwoda: state.currentTwoda,
    loadTwoda: state.loadTwoda,
    disposeTwoda: state.disposeTwoda,
  })));

  useGhostRouteId('twodaId', loadTwoda, disposeTwoda);

  if (loading && !currentTwoda) return <CircularProgress />;
  if (!currentTwoda) return null;

  return (
    <div>
      <T title="resourceName" value={currentTwoda.resourceName} />
      <T title="encrypted" value={String(currentTwoda.encrypted)} />
      <T title="signature" value={currentTwoda.signature} />
      <T title="defaultValue" value={currentTwoda.defaultValue} />
      <T title="columns" value={currentTwoda.columns.join(', ')} />
      <T title="rows" value={currentTwoda.rows.length} />
      {currentTwoda.rows.map(row => (
        <T key={row.name} title={row.name} value={row.cells.join(', ')} />
      ))}
    </div>
  );
};

export default Twoda;
