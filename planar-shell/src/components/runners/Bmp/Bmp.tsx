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
import { useBmpStore } from './store/bmpStore';
import { useBmpWidgetBridge } from './useBmpWidgetBridge';
import { useTranslation } from 'react-i18next';
import { isNothing } from '@planar/shared';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

import styles from './Bmp.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number | boolean>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value === undefined || value === null ? '' : String(value)} />;

const Bmp: FC = () => {
  const { t } = useTranslation();
  useBmpWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'bmp');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    serverUrl,
    currentBmp,
    disposeBmp,
  } = useBmpStore(useShallow(state => ({
    loading: state.loading,
    serverUrl: state.serverUrl,
    currentBmp: state.currentBmp,
    disposeBmp: state.disposeBmp,
  })));

  const [imageUrl, setImageUrl] = useState<Maybe<string>>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => () => disposeBmp(), [disposeBmp]);

  const imageName = currentBmp?.imageName ?? null;

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

    const filePath = encodeURIComponent(`ghost/bmp/${imageName}`);
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

  if (loading && !currentBmp) return <CircularProgress />;
  if (!currentBmp) return null;

  const header = currentBmp.header;

  return (
    <div>
      {!isNothing(imageUrl) && <img className={styles.image} src={imageUrl} alt={imageName ?? ''} />}
      <T title="imageName" value={currentBmp.imageName} />
      <T title="resourceName" value={currentBmp.resourceName} />
      <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>header</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(header).map(([key, value]) => (
            <T key={key} title={key} value={value} />
          ))}
        </AccordionDetails>
      </Accordion>
      {!isNothing(currentBmp.paletteLayout) && (
        <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>paletteLayout</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(currentBmp.paletteLayout).map(([key, value]) => (
              <T key={key} title={key} value={value} />
            ))}
          </AccordionDetails>
        </Accordion>
      )}
      {!isNothing(currentBmp.indicesLayout) && (
        <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>indicesLayout</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(currentBmp.indicesLayout).map(([key, value]) => (
              <T key={key} title={key} value={value} />
            ))}
          </AccordionDetails>
        </Accordion>
      )}
      {imageLoading && <CircularProgress />}
      {imageError && <Typography>{t('run.imageLoadError')}</Typography>}
    </div>
  );
};

export default Bmp;
