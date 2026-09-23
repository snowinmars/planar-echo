import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { nothing } from '@planar/shared';

import { patchLocalDir, readLocalDirs } from '@/shared/defaultsApi';

import type { BaseTextFieldProps } from '@mui/material/TextField';
import type { FC } from 'react';

import type { Maybe } from '@planar/shared';

const ANIMATION_TIME_MS = 3000;

type Status = 'nothing' | 'loading' | 'saving' | 'saved' | 'failed';

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
    case 'loading': return 'settings.modsDir.loading';
    case 'saving': return 'settings.modsDir.saving';
    case 'saved': return 'settings.modsDir.saved';
    case 'failed': return 'settings.modsDir.failed';
  }
};

const ModsDir: FC = () => {
  const { t } = useTranslation();
  const [modsDir, setModsDir] = useState<string>(() => readLocalDirs().modsRuntimeDir);
  const [status, setStatus] = useState<Status>('nothing');
  const [color, setColor] = useState(() => statusToColor(status));
  const [helperText, setHelperText] = useState<string>(() => statusToHelperText(status));
  const saveTimeout = useRef<Maybe<NodeJS.Timeout>>(nothing());
  const saveAbortController = useRef<AbortController>(new AbortController());

  useEffect(() => {
    setColor(statusToColor(status));
    const translationId = statusToHelperText(status);
    if (translationId) setHelperText(t(translationId));
    else setHelperText('');
  }, [status, t]);

  return (
    <div>
      <TextField
        value={modsDir}
        color={color}
        error={status === 'failed'}
        fullWidth
        label={t('settings.modsDir.title')}
        variant="standard"
        placeholder="D:/.../planar-mods-runtime"
        helperText={helperText}
        onChange={(e) => {
          saveAbortController.current.abort();
          saveAbortController.current = new AbortController();
          if (saveTimeout.current) clearTimeout(saveTimeout.current);

          const value = e.target.value;
          setModsDir(value);
          setStatus('saving');

          patchLocalDir('modsRuntimeDir', value, saveAbortController.current.signal)
            .then(() => {
              setStatus('saved');
              saveTimeout.current = setTimeout(() => {
                setStatus('nothing');
              }, ANIMATION_TIME_MS);
            })
            .catch((err: unknown) => {
              if (err instanceof DOMException && err.name === 'AbortError') return;
              console.error(err);
              setStatus('failed');
            });
        }}
      />
    </div>
  );
};

export default ModsDir;
