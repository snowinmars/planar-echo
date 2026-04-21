import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

// import styles from './DialogueRendererSwitcher.module.scss';

export const DialogueRendererSwitcher: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const [renderer, setRenderer] = useState<string>(() => {
    const dialogueRenderer = planarLocalStorage.get('dialogueRenderer');
    if (dialogueRenderer) return dialogueRenderer;
    const defaultDialogueRenderer = 'pstee';
    planarLocalStorage.set('dialogueRenderer', defaultDialogueRenderer);
    return defaultDialogueRenderer;
  });

  return (
    <FormControl
      className={className}
      fullWidth
    >
      <InputLabel>{t('settings.dialogueRenderer')}</InputLabel>
      <Select
        value={renderer}
        onChange={(e) => {
          setRenderer(e.target.value);
        }}
      >
        {
          ['pstee', 'narrat', 'renpy', 'mobile'].map(renderer => (
            <MenuItem key={renderer} value={renderer}>
              <Typography>{t(`settings.${renderer}`)}</Typography>
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};
