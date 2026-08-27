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
import { useWedStore } from './store/wedStore';
import { useWedWidgetBridge } from './useWedWidgetBridge';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

// import styles from './Wed.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Wed: FC = () => {
  useWedWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'wed');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentWed,
    loadWed,
    disposeWed,
  } = useWedStore(useShallow(state => ({
    loading: state.loading,
    currentWed: state.currentWed,
    loadWed: state.loadWed,
    disposeWed: state.disposeWed,
  })));

  useGhostRouteId('wedId', loadWed, disposeWed);

  useEffect(() => () => disposeWed(), [disposeWed]);

  if (loading && !currentWed) return <CircularProgress />;
  if (!currentWed) return null;

  return (
    <div>
      <T title="resourceName" value={currentWed.resourceName} />
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>header</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="signature" value={currentWed.header.signature} />
          <T title="version" value={currentWed.header.version} />
          <T title="overlaysCount" value={currentWed.header.overlaysCount} />
          <T title="doorsCount" value={currentWed.header.doorsCount} />
          <T title="wallPolygonCount" value={currentWed.header.wallPolygonCount} />
        </AccordionDetails>
      </Accordion>
      {
        currentWed.overlays.map((overlay, i) => (
          <Accordion key={`wed_overlay_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                overlay
                {' '}
                {i}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <T title="width" value={overlay.width} />
              <T title="height" value={overlay.height} />
              <T title="tileset" value={overlay.tileset} />
              <T title="uniqueTileCount" value={overlay.uniqueTileCount} />
              <T title="movementType" value={overlay.movementType} />
              <T title="tilemaps" value={JSON.stringify(overlay.tilemaps)} />
            </AccordionDetails>
          </Accordion>
        ))
      }
      {
        currentWed.doors.map((door, i) => (
          <Accordion key={`wed_door_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                door
                {' '}
                {door.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <T title="name" value={door.name} />
              <T title="isOpen" value={String(door.isOpen)} />
              <T title="firstDoorTileCellIndex" value={door.firstDoorTileCellIndex} />
              <T title="doorTileCellCount" value={door.doorTileCellCount} />
              <T title="openPolygonCount" value={door.openPolygonCount} />
              <T title="closedPolygonCount" value={door.closedPolygonCount} />
              <T title="doorTileCells" value={door.doorTileCells.join(', ')} />
              <T title="openPolygons" value={JSON.stringify(door.openPolygons)} />
              <T title="closedPolygons" value={JSON.stringify(door.closedPolygons)} />
            </AccordionDetails>
          </Accordion>
        ))
      }
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>vertices</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="count" value={currentWed.vertices.length} />
          <T title="vertices" value={JSON.stringify(currentWed.vertices)} />
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>wallPolygons</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="count" value={currentWed.wallPolygons.length} />
          <T title="wallPolygons" value={JSON.stringify(currentWed.wallPolygons)} />
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>wallGroups</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {
            currentWed.wallGroups.map((group, i) => (
              <Accordion key={`wed_wall_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{i}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <T title="lookupStart" value={group.lookupStart} />
                  <T title="lookupCount" value={group.lookupCount} />
                  <T title="polygonIndices" value={group.polygonIndices.join(', ')} />
                </AccordionDetails>
              </Accordion>
            ))
          }
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Wed;
