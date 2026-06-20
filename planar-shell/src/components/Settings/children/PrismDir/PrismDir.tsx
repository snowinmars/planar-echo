import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import planarLocalStorage from '@/shared/planarLocalStorage';
import TextField from '@mui/material/TextField';
import { getApiSettingsPrismDir, postApiSettingsPrismDir } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';
import { nothing } from '@planar/shared';
import { isAxiosError } from 'axios';

import type { FC } from 'react';
import type { BaseTextFieldProps } from '@mui/material/TextField';
import type { Maybe } from '@planar/shared';

import styles from './PrismDir.module.scss';

const ANIMATION_TIME_MS = 3000;

type Status
  = | 'nothing'
    | 'loading'
    | 'saving'
    | 'saved'
    | 'failed'
;

const statusToColor = (status: Status): BaseTextFieldProps['color'] => {
  switch (status) {
    case 'nothing': return 'primary';
    case 'loading': return 'secondary';
    case 'saving': return 'secondary';
    case 'saved': return 'success';
    case 'failed': return 'error';
  }
};

const statusToHelperText = (status: Status): string => {
  switch (status) {
    case 'nothing': return '';
    case 'loading': return 'settings.prismDir.loading';
    case 'saving': return 'settings.prismDir.saving';
    case 'saved': return 'settings.prismDir.saved';
    case 'failed': return 'settings.prismDir.failed';
  }
};

const PrismDir: FC = () => {
  const { t } = useTranslation();

  const [prismDir, setPrismDir] = useState<string>(() => planarLocalStorage.get('prismDir', '')!);
  const [status, setStatus] = useState<Status>('loading');
  const [color, setColor] = useState(() => statusToColor(status));
  const [helperText, setHelperText] = useState<string>(() => statusToHelperText(status));
  const saveTimeout = useRef<Maybe<NodeJS.Timeout>>(nothing());
  const saveAbortController = useRef<AbortController>(new AbortController());

  useEffect(() => {
    getApiSettingsPrismDir({
      client,
      signal: saveAbortController.current.signal,
    })
      .then(({ error, data }): void => {
        if (error) {
          console.error(error);
          setPrismDir(planarLocalStorage.get('prismDir', '')!);
        }
        else {
          setPrismDir(data!.prismDir); // TODO [snow]: why '!'?
        }
      })
      .catch(e => console.error(e))
      .finally(() => {
        setStatus('nothing');
      });
  }, []);

  useEffect(() => {
    setColor(statusToColor(status));

    const translationId = statusToHelperText(status);
    if (translationId) setHelperText(t(translationId));
    else setHelperText('');
  }, [status]);

  return (
    <div>
      <TextField
        className={styles.input}
        value={prismDir}
        color={color}
        error={status === 'failed'}
        fullWidth
        label={t('settings.prismDir.title')}
        variant="standard"
        placeholder="D:/.../planar-prism"
        helperText={helperText}
        onChange={(e) => {
          saveAbortController.current.abort();
          saveAbortController.current = new AbortController();
          if (saveTimeout.current) clearTimeout(saveTimeout.current);

          const value = e.target.value;
          setPrismDir(value);
          setStatus('saving');
          planarLocalStorage.set('prismDir', value);

          postApiSettingsPrismDir({
            client,
            signal: saveAbortController.current.signal,
            body: {
              prismDir: value,
            },
          })
            .then((response) => {
              if (response.error && isAxiosError(response)) {
                if (response.code !== 'ERR_CANCELED') {
                  console.error(response);
                  setStatus('failed');
                }
                return;
              }

              setStatus('saved');
              saveTimeout.current = setTimeout(() => {
                setStatus('nothing');
              }, ANIMATION_TIME_MS);
            }).catch((e: unknown) => {
              console.error(e);
              setStatus('failed');
            });
        }}
      >
      </TextField>
    </div>
  );
};

export default PrismDir;
