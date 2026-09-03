import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

import { isNothing } from '@planar/shared';

import { assetUrl } from '@/shared/assetUrl';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';

import { useAcmStore } from './store/acmStore';
import { useAcmWidgetBridge } from './useAcmWidgetBridge';

import type { FC } from 'react';

import type { GhostType, Maybe } from '@planar/shared';

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
    planarLocalStorage.set<Maybe<GhostType>>(planarLocalStorage.currentWidget, 'acm');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    serverUrl,
    currentAcm,
    loadAcm,
    disposeAcm,
  } = useAcmStore(useShallow(state => ({
    loading: state.loading,
    serverUrl: state.serverUrl,
    currentAcm: state.currentAcm,
    loadAcm: state.loadAcm,
    disposeAcm: state.disposeAcm,
  })));

  useGhostRouteId('acmId', loadAcm, disposeAcm);

  const [audioError, setAudioError] = useState(false);

  useEffect(() => () => disposeAcm(), [disposeAcm]);

  const audioName = currentAcm?.audioName ?? null;
  const audioUrl = audioName ? assetUrl(serverUrl, 'acm', audioName) : null;

  useEffect(() => {
    setAudioError(false);
  }, [audioUrl]);

  if (loading && !currentAcm) return <CircularProgress />;
  if (!currentAcm) return null;

  return (
    <div>
      {!isNothing(audioUrl) && (
        <audio className={styles.audio} controls src={audioUrl} onError={() => setAudioError(true)}>
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
      {audioError && <Typography>{t('run.audioLoadError')}</Typography>}
    </div>
  );
};

export default Acm;
