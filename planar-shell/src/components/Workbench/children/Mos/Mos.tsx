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
import { useGhostRouteId } from '@/shared/useGhostRouteId';
import { assetUrl } from '@/shared/assetUrl';
import { useMosStore } from './store/mosStore';
import { useMosWidgetBridge } from './useMosWidgetBridge';
import { useTranslation } from 'react-i18next';
import { isNothing } from '@planar/shared';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

import styles from './Mos.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Mos: FC = () => {
  const { t } = useTranslation();
  useMosWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'mos');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    serverUrl,
    currentMos,
    loadMos,
    disposeMos,
  } = useMosStore(useShallow(state => ({
    loading: state.loading,
    serverUrl: state.serverUrl,
    currentMos: state.currentMos,
    loadMos: state.loadMos,
    disposeMos: state.disposeMos,
  })));

  useGhostRouteId('mosId', loadMos, disposeMos);

  const [imageError, setImageError] = useState(false);

  useEffect(() => () => disposeMos(), [disposeMos]);

  const imageName = currentMos && 'imageName' in currentMos ? currentMos.imageName : null;
  const imageUrl = imageName ? assetUrl(serverUrl, 'mos', imageName) : null;

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  if (loading && !currentMos) return <CircularProgress />;
  if (!currentMos) return null;

  const version = currentMos.header.version;

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
      <T title="imageName" value={currentMos.imageName} />
      <T title="resourceName" value={currentMos.resourceName} />
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>header</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="signature" value={currentMos.header.signature} />
          <T title="version" value={currentMos.header.version} />
          <T title="width" value={currentMos.header.width} />
          <T title="height" value={currentMos.header.height} />
          {version === 'v1' && (
            <>
              <T title="columns" value={currentMos.header.columns} />
              <T title="rows" value={currentMos.header.rows} />
              <T title="blockSize" value={currentMos.header.blockSize} />
              <T title="paletteOffset" value={currentMos.header.paletteOffset} />
            </>
          )}
          {version === 'v2' && (
            <>
              <T title="blockCount" value={currentMos.header.blockCount} />
              <T title="blocksOffset" value={currentMos.header.blocksOffset} />
            </>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            Blocks (
            {currentMos.blocks.length}
            )
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {
            currentMos.blocks.map((block, i) => (
              <Accordion key={`mos_block_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    block
                    {' '}
                    {i}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <T title="index" value={block.index} />
                  {'col' in block && <T title="col" value={block.col} />}
                  {'row' in block && <T title="row" value={block.row} />}
                  {'width' in block && <T title="width" value={block.width} />}
                  {'height' in block && <T title="height" value={block.height} />}
                  {'page' in block && <T title="page" value={block.page} />}
                  {'pvrzResourceName' in block && <T title="pvrzResourceName" value={block.pvrzResourceName} />}
                  {'sourceX' in block && <T title="sourceX" value={block.sourceX} />}
                  {'sourceY' in block && <T title="sourceY" value={block.sourceY} />}
                  {'targetX' in block && <T title="targetX" value={block.targetX} />}
                  {'targetY' in block && <T title="targetY" value={block.targetY} />}
                  {'paletteByteOffset' in block && <T title="paletteByteOffset" value={block.paletteByteOffset} />}
                  {'lookupOffset' in block && <T title="lookupOffset" value={block.lookupOffset} />}
                  {'pixelDataOffset' in block && <T title="pixelDataOffset" value={block.pixelDataOffset} />}
                </AccordionDetails>
              </Accordion>
            ))
          }
        </AccordionDetails>
      </Accordion>
      {imageError && <Typography>{t('run.imageLoadError')}</Typography>}
    </div>
  );
};

export default Mos;
