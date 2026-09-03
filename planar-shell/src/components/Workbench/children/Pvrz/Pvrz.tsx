import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';

import { usePvrzStore } from './store/pvrzStore';
import { usePvrzWidgetBridge } from './usePvrzWidgetBridge';

import type { FC } from 'react';

import type { GhostType, Maybe } from '@planar/shared';

// import styles from './Pvrz.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Pvrz: FC = () => {
  usePvrzWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<GhostType>>(planarLocalStorage.currentWidget, 'pvrz');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentPvrz,
    loadPvrz,
    disposePvrz,
  } = usePvrzStore(useShallow(state => ({
    loading: state.loading,
    currentPvrz: state.currentPvrz,
    loadPvrz: state.loadPvrz,
    disposePvrz: state.disposePvrz,
  })));

  useGhostRouteId('pvrzId', loadPvrz, disposePvrz);

  useEffect(() => () => disposePvrz(), [disposePvrz]);

  if (loading && !currentPvrz) return <CircularProgress />;
  if (!currentPvrz) return null;

  return (
    <div>
      <T title="resourceName" value={currentPvrz.resourceName} />
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>header</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="signature" value={currentPvrz.signature} />
          <T title="flags" value={currentPvrz.flags} />
          <T title="pixelFormat" value={currentPvrz.pixelFormat} />
          <T title="colorSpace" value={currentPvrz.colorSpace} />
          <T title="channelType" value={currentPvrz.channelType} />
          <T title="height" value={currentPvrz.height} />
          <T title="width" value={currentPvrz.width} />
          <T title="depth" value={currentPvrz.depth} />
          <T title="numSurfaces" value={currentPvrz.numSurfaces} />
          <T title="numFaces" value={currentPvrz.numFaces} />
          <T title="mipmapCount" value={currentPvrz.mipmapCount} />
          <T title="metadataSize" value={currentPvrz.metadataSize} />
          <T title="pixelDataOffset" value={currentPvrz.pixelDataOffset} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Pvrz;
