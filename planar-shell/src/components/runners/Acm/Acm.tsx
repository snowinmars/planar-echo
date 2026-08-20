import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useAcmStore } from './store/acmStore';
import { useAcmWidgetBridge } from './useAcmWidgetBridge';
import { useTranslation } from 'react-i18next';
import { isNothing } from '@planar/shared';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

import styles from './Acm.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Acm: FC = () => {
  const { t } = useTranslation();
  useAcmWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'acm');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    serverUrl,
    currentAcm,
    disposeAcm,
  } = useAcmStore(useShallow(state => ({
    loading: state.loading,
    serverUrl: state.serverUrl,
    currentAcm: state.currentAcm,
    disposeAcm: state.disposeAcm,
  })));

  const [audioUrl, setAudioUrl] = useState<Maybe<string>>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => () => disposeAcm(), [disposeAcm]);

  const audioName = currentAcm?.audioName ?? null;

  useEffect(() => {
    if (!audioName) {
      setAudioUrl(null);
      setAudioError(false);
      setAudioLoading(false);
      return;
    }

    let cancelled = false;
    let objectUrl: string | undefined;
    setAudioLoading(true);
    setAudioError(false);
    setAudioUrl(null);

    const filePath = encodeURIComponent(`ghost/acm/${audioName}`);
    fetch(`${serverUrl}/api/fs/ghostDir/${filePath}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setAudioUrl(objectUrl);
      })
      .catch((e: unknown) => {
        console.error(e);
        if (!cancelled) setAudioError(true);
      })
      .finally(() => {
        if (!cancelled) setAudioLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [audioName, serverUrl]);

  if (loading && !currentAcm) return <CircularProgress />;
  if (!currentAcm) return null;

  return (
    <div>
      {!isNothing(audioUrl) && (
        <audio className={styles.audio} controls src={audioUrl}>
          <track kind="captions" />
        </audio>
      )}
      <T title="resourceName" value={currentAcm.resourceName} />
      <T title="audioName" value={currentAcm.audioName} />
      <T title="container" value={currentAcm.container} />
      <T title="channels" value={currentAcm.channels} />
      <T title="sampleRate" value={currentAcm.sampleRate} />
      <T title="bitsPerSample" value={currentAcm.bitsPerSample} />
      <T title="sampleCount" value={currentAcm.sampleCount} />
      {audioLoading && <CircularProgress />}
      {audioError && <Typography>{t('run.audioLoadError')}</Typography>}
    </div>
  );
};

export default Acm;
