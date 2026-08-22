import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { assetUrl } from '@/shared/assetUrl';
import { useBamStore } from './store/bamStore';
import { useBamWidgetBridge } from './useBamWidgetBridge';
import { useTranslation } from 'react-i18next';
import { isNothing } from '@planar/shared';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

import styles from './Bam.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number | boolean>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value === undefined || value === null ? '' : String(value)} />;

const Bam: FC = () => {
  const { t } = useTranslation();
  useBamWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'bam');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    serverUrl,
    currentBam,
    disposeBam,
  } = useBamStore(useShallow(state => ({
    loading: state.loading,
    serverUrl: state.serverUrl,
    currentBam: state.currentBam,
    disposeBam: state.disposeBam,
  })));

  const [imageError, setImageError] = useState(false);

  useEffect(() => () => disposeBam(), [disposeBam]);

  const imageName = currentBam?.imageName ?? null;
  const imageUrl = imageName ? assetUrl(serverUrl, 'bam', imageName) : null;

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  if (loading && !currentBam) return <CircularProgress />;
  if (!currentBam) return null;

  return (
    <div>
      {!isNothing(imageUrl) && (
        <img
          className={styles.image}
          src={imageUrl}
          alt={imageName ?? ''}
          onError={() => setImageError(true)}
        />
      )}
      <T title="imageName" value={currentBam.imageName} />
      <T title="resourceName" value={currentBam.resourceName} />
      <T title="atlasWidth" value={currentBam.atlasWidth} />
      <T title="atlasHeight" value={currentBam.atlasHeight} />
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>header</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(currentBam.header).map(([key, value]) => (
            <T key={key} title={key} value={value} />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Frames</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {currentBam.frames.map((frame, i) => (
            <Accordion key={`bam_frame_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  frame
                  {' '}
                  {i}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Object.entries(frame).map(([key, value]) => (
                  <T key={key} title={key} value={value} />
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Cycles</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {currentBam.cycles.map((cycle, i) => (
            <Accordion key={`bam_cycle_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  cycle
                  {' '}
                  {i}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <T title="index" value={cycle.index} />
                <T title="framesCount" value={cycle.framesCount} />
                {'firstLookup' in cycle && <T title="firstLookup" value={cycle.firstLookup} />}
                {'firstFrame' in cycle && <T title="firstFrame" value={cycle.firstFrame} />}
                <T title="frameIndices" value={cycle.frameIndices.join(', ')} />
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>

      {'blocks' in currentBam && (
        <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Blocks</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {
              currentBam.blocks.map((block, i) => (
                <Accordion key={`bam_block_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      block
                      {' '}
                      {i}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {Object.entries(block).map(([key, value]) => (
                      <T key={key} title={key} value={value} />
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))
            }
          </AccordionDetails>
        </Accordion>
      )}
      {imageError && <Typography>{t('run.imageLoadError')}</Typography>}
    </div>
  );
};

export default Bam;
