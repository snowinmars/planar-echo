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
import { useTisStore } from './store/tisStore';
import { useTisWidgetBridge } from './useTisWidgetBridge';
import { useTranslation } from 'react-i18next';
import { isNothing } from '@planar/shared';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

import styles from './Tis.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Tis: FC = () => {
  const { t } = useTranslation();
  useTisWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'tis');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    serverUrl,
    currentTis,
    disposeTis,
  } = useTisStore(useShallow(state => ({
    loading: state.loading,
    serverUrl: state.serverUrl,
    currentTis: state.currentTis,
    disposeTis: state.disposeTis,
  })));

  const [imageUrl, setImageUrl] = useState<Maybe<string>>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => () => disposeTis(), [disposeTis]);

  const imageName = currentTis?.imageName ?? null;

  useEffect(() => {
    if (!imageName) {
      setImageUrl(null);
      setImageError(false);
      setImageLoading(false);
      return;
    }

    let cancelled = false;
    let objectUrl: string | undefined;
    setImageLoading(true);
    setImageError(false);
    setImageUrl(null);

    const filePath = encodeURIComponent(`ghost/tis/${imageName}`);
    fetch(`${serverUrl}/api/fs/ghostDir/${filePath}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      })
      .catch((e: unknown) => {
        console.error(e);
        if (!cancelled) setImageError(true);
      })
      .finally(() => {
        if (!cancelled) setImageLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageName, serverUrl]);

  if (loading && !currentTis) return <CircularProgress />;
  if (!currentTis) return null;

  return (
    <div>
      {!isNothing(imageUrl) && <img className={styles.image} src={imageUrl} alt={imageName ?? ''} />}
      <T title="imageName" value={currentTis.imageName} />
      <T title="resourceName" value={currentTis.resourceName} />
      <T title="variant" value={currentTis.variant} />
      <T title="columns" value={currentTis.columns} />
      <T title="rows" value={currentTis.rows} />
      <T title="atlasWidthSource" value={currentTis.atlasWidthSource} />
      {currentTis.variant === 'palette' && (
        <>
          <T title="paletteName" value={currentTis.paletteName} />
          <T title="indicesName" value={currentTis.indicesName} />
        </>
      )}
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>header</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <T title="signature" value={currentTis.header.signature} />
          <T title="version" value={currentTis.header.version} />
          <T title="tileCount" value={currentTis.header.tileCount} />
          <T title="tileSize" value={currentTis.header.tileSize} />
          <T title="headerSize" value={currentTis.header.headerSize} />
          <T title="tileDimension" value={currentTis.header.tileDimension} />
        </AccordionDetails>
      </Accordion>
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            tiles
            {' '}
            {currentTis.tiles.length}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {
            currentTis.tiles.map((tile, i) => (
              <Accordion key={`tis_tile_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{tile.index}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <T title="index" value={tile.index} />
                  {'page' in tile && <T title="page" value={tile.page} />}
                  {'x' in tile && <T title="x" value={tile.x} />}
                  {'y' in tile && <T title="y" value={tile.y} />}
                  {'pvrzResourceName' in tile && <T title="pvrzResourceName" value={tile.pvrzResourceName} />}
                </AccordionDetails>
              </Accordion>
            ))
          }
        </AccordionDetails>
      </Accordion>
      {imageLoading && <CircularProgress />}
      {imageError && <Typography>{t('run.imageLoadError')}</Typography>}
    </div>
  );
};

export default Tis;
