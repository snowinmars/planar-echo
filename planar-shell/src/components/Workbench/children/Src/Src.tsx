import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';

import { useSrcStore } from './store/srcStore';
import { useSrcWidgetBridge } from './useSrcWidgetBridge';

import type { FC } from 'react';

import type { GhostType, Maybe } from '@planar/shared';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Src: FC = () => {
  useSrcWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<GhostType>>(planarLocalStorage.currentWidget, 'src');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentSrc,
    loadSrc,
    disposeSrc,
  } = useSrcStore(useShallow(state => ({
    loading: state.loading,
    currentSrc: state.currentSrc,
    loadSrc: state.loadSrc,
    disposeSrc: state.disposeSrc,
  })));

  useGhostRouteId('srcId', loadSrc, disposeSrc);

  if (loading && !currentSrc) return <CircularProgress />;
  if (!currentSrc) return null;

  return (
    <div>
      <T title="resourceName" value={currentSrc.resourceName} />
      <T title="entries" value={currentSrc.entries.length} />
      {currentSrc.entries.map((entry, i) => (
        <T key={`${entry.strref}_${i}`} title={`${entry.strref}`} value={entry.weight} />
      ))}
    </div>
  );
};

export default Src;
