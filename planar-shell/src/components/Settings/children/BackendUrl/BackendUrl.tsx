import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import planarLocalStorage from '@/shared/planarLocalStorage';
import TextField from '@mui/material/TextField';
import { getApiPing } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';
import { nothing } from '@planar/shared';

import styles from './BackendUrl.module.scss';

import type { FC } from 'react';
import type { BaseTextFieldProps } from '@mui/material/TextField';
import type { Maybe } from '@planar/shared';
import { isAxiosError } from 'axios';

const ANIMATION_TIME_MS = 3000;

type Status
  = | 'nothing'
    | 'pinging'
    | 'pingSucceed'
    | 'pingFailed'
;

const statusToColor = (status: Status): BaseTextFieldProps['color'] => {
  switch (status) {
    case 'nothing': return 'primary';
    case 'pinging': return 'secondary';
    case 'pingSucceed': return 'success';
    case 'pingFailed': return 'error';
  }
};

const statusToHelperText = (status: Status): string => {
  switch (status) {
    case 'nothing': return '';
    case 'pinging': return 'settings.backendUrl.pinging';
    case 'pingSucceed': return 'settings.backendUrl.pingSucceed';
    case 'pingFailed': return 'settings.backendUrl.pingFailed';
  }
};

export const BackendUrl: FC = () => {
  const { t } = useTranslation();

  const [serverUrl, setServerUrl] = useState<string>(() => planarLocalStorage.get('serverUrl', '')!);
  const [status, setStatus] = useState<Status>('nothing');
  const [color, setColor] = useState(() => statusToColor(status));
  const [helperText, setHelperText] = useState<string>(() => statusToHelperText(status));
  const pingTimeout = useRef<Maybe<NodeJS.Timeout>>(nothing());
  const pingAbortController = useRef<AbortController>(new AbortController());

  useEffect(() => {
    setColor(statusToColor(status));
  }, [status]);

  useEffect(() => {
    const translationId = statusToHelperText(status);
    if (translationId) setHelperText(t(translationId));
    else setHelperText('');
  }, [status]);

  return (
    <div>
      <TextField
        className={styles.input}
        value={serverUrl}
        color={color}
        error={status === 'pingFailed'}
        fullWidth
        label={t('settings.backendUrl.title')}
        variant="standard"
        placeholder="http://localhost:3003"
        helperText={helperText}
        onChange={(e) => {
          pingAbortController.current.abort();
          pingAbortController.current = new AbortController();
          if (pingTimeout.current) clearTimeout(pingTimeout.current);

          const value = e.target.value;
          setServerUrl(value);
          setStatus('pinging');
          planarLocalStorage.set('serverUrl', value);

          getApiPing({
            client,
            baseURL: value,
            signal: pingAbortController.current.signal,
          })
            .then((response) => {
              if (response.error && isAxiosError(response)) {
                if (response.code !== 'ERR_CANCELED') {
                  console.error(response);
                  setStatus('pingFailed');
                }
                return;
              }

              if (response.data !== 'pong asclepius') {
                console.error(response.error);
                setStatus('pingFailed');
                return;
              }

              setStatus('pingSucceed');
              pingTimeout.current = setTimeout(() => {
                setStatus('nothing');
              }, ANIMATION_TIME_MS);
            }).catch((e: unknown) => {
              console.error(e);
              setStatus('pingFailed');
            });
        }}
      >
      </TextField>
    </div>
  );
};
