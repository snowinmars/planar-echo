import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';
import { useMusStore } from './store/musStore';
import { useMusWidgetBridge } from './useMusWidgetBridge';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number | boolean>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value === undefined || value === null ? '' : String(value)} />;

const Mus: FC = () => {
  useMusWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'mus');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentMus,
    loadMus,
    disposeMus,
  } = useMusStore(useShallow(state => ({
    loading: state.loading,
    currentMus: state.currentMus,
    loadMus: state.loadMus,
    disposeMus: state.disposeMus,
  })));

  useGhostRouteId('musId', loadMus, disposeMus);

  useEffect(() => () => disposeMus(), [disposeMus]);

  if (loading && !currentMus) return <CircularProgress />;
  if (!currentMus) return null;

  return (
    <div>
      <T title="resourceName" value={currentMus.resourceName} />
      <T title="subfolder" value={currentMus.subfolder} />
      <T title="count" value={currentMus.count} />
      {currentMus.segments.map((segment, i) => (
        <Accordion key={`mus_segment_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              segment
              {' '}
              {i}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <T title="entry" value={segment.entry} />
            <T title="isSilence" value={segment.isSilence} />
            <T title="next" value={JSON.stringify(segment.next)} />
            <T title="tag" value={JSON.stringify(segment.tag)} />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default Mus;
