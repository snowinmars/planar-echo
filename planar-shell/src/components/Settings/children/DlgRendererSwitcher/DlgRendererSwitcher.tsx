import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';

import type { WithClassName } from '@/types/fcWithClassName';

// import styles from './DlgRendererSwitcher.module.scss';

export const DlgRendererSwitcher: FC<WithClassName> = ({ className }) => {
  const { t } = useTranslation();
  const [renderer, setRenderer] = useState<string>(() => {
    const dlgRenderer = planarLocalStorage.get('dlgRenderer');
    if (dlgRenderer) return dlgRenderer;
    const defaultDlgRenderer = 'pstee-two-columns';
    planarLocalStorage.set('dlgRenderer', defaultDlgRenderer);
    return defaultDlgRenderer;
  });

  return (
    <FormControl
      className={className}
      fullWidth
    >
      <InputLabel>{t('settings.dlgRenderer.title')}</InputLabel>
      <Select
        value={renderer}
        onChange={(e) => {
          const value = e.target.value;
          setRenderer(value);
          planarLocalStorage.set('dlgRenderer', value);
        }}
      >
        {
          ['pstee', 'pstee-two-columns', 'narrat'].map(renderer => (
            <MenuItem key={renderer} value={renderer}>
              <Typography>{t(`settings.dlgRenderer.${renderer}`)}</Typography>
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};
