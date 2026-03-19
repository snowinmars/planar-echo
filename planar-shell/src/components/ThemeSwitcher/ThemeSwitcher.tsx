import {useState} from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { useTheme } from '@/theme/context';

import type {FC} from 'react';
import type { ThemeMode } from '@/theme/types';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './ThemeSwitcher.module.scss';

export const ThemeSwitcher: FC<WithClassName> = ({className}) => {
  const [themes] = useState<ThemeMode[]>(() => ['light', 'dark']);
  const [ theme, setTheme ] = useTheme();
  const { t } = useTranslation();

  return (
    <FormControl
      className={className}
      sx={{ minWidth: "5em" }}
    >
      <Select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
        displayEmpty
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {t(`themes.${selected}`)}
          </Box>
        )}
      >
        {
          themes.map(theme => (
            <MenuItem key={theme} value={theme}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t(`themes.${theme}`)}
              </Box>
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};
