import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';

import { useIdsStore } from './store/idsStore';
import { useIdsWidgetBridge } from './useIdsWidgetBridge';

import type { FC } from 'react';

import type { GhostType, Maybe } from '@planar/shared';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Ids: FC = () => {
  useIdsWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<GhostType>>(planarLocalStorage.currentWidget, 'ids');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentIds,
    loadIds,
    disposeIds,
  } = useIdsStore(useShallow(state => ({
    loading: state.loading,
    currentIds: state.currentIds,
    loadIds: state.loadIds,
    disposeIds: state.disposeIds,
  })));

  useGhostRouteId('idsId', loadIds, disposeIds);

  useEffect(() => () => disposeIds(), [disposeIds]);

  if (loading && !currentIds) return <CircularProgress />;
  if (!currentIds) return null;

  const entries = [...currentIds.entries.entries()];

  return (
    <div>
      <T title="resourceName" value={currentIds.resourceName} />
      <T title="wrongSignature" value={currentIds.header.wrongSignature} />
      <T title="wrongEntryCount" value={currentIds.header.wrongEntryCount} />
      <T title="entries" value={entries.length} />
      {entries.map(([key, names]) => <T title={key.toString()} value={names.join(', ')} />)}
    </div>
  );
};

export default Ids;
