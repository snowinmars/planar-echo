import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';
import { assetUrl } from '@/shared/assetUrl';
import { useWavStore } from './store/wavStore';
import { useWavWidgetBridge } from './useWavWidgetBridge';
import { useTranslation } from 'react-i18next';
import { isNothing } from '@planar/shared';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

import styles from './Wav.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Wav: FC = () => {
  const { t } = useTranslation();
  useWavWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'wav');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    serverUrl,
    currentWav,
    loadWav,
    disposeWav,
  } = useWavStore(useShallow(state => ({
    loading: state.loading,
    serverUrl: state.serverUrl,
    currentWav: state.currentWav,
    loadWav: state.loadWav,
    disposeWav: state.disposeWav,
  })));

  useGhostRouteId('wavId', loadWav, disposeWav);

  const [audioError, setAudioError] = useState(false);

  useEffect(() => () => disposeWav(), [disposeWav]);

  const audioName = currentWav?.audioName ?? null;
  const audioUrl = audioName ? assetUrl(serverUrl, 'wav', audioName) : null;

  useEffect(() => {
    setAudioError(false);
  }, [audioUrl]);

  if (loading && !currentWav) return <CircularProgress />;
  if (!currentWav) return null;

  return (
    <div>
      {!isNothing(audioUrl) && (
        <audio className={styles.audio} controls src={audioUrl} onError={() => setAudioError(true)}>
          <track kind="captions" />
        </audio>
      )}
      <T title="resourceName" value={currentWav.resourceName} />
      <T title="audioName" value={currentWav.audioName} />
      <T title="container" value={currentWav.container} />
      <T title="channels" value={currentWav.channels} />
      <T title="sampleRate" value={currentWav.sampleRate} />
      <T title="bitsPerSample" value={currentWav.bitsPerSample} />
      <T title="sampleCount" value={currentWav.sampleCount} />
      {audioError && <Typography>{t('run.audioLoadError')}</Typography>}
    </div>
  );
};

export default Wav;
