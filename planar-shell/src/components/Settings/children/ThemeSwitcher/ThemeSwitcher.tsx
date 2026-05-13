import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { useTheme } from '@/theme/context';
import PaletteIcon from '@mui/icons-material/Palette';
import clsx from 'clsx';
import InputLabel from '@mui/material/InputLabel';

import type { FC } from 'react';
import type { ThemeMode } from '@/theme/types';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './ThemeSwitcher.module.scss';

type IconWrapperProps = Readonly<{
  theme: ThemeMode;
}>;
const IconWrapper: FC<IconWrapperProps> = ({ theme }: IconWrapperProps) => {
  const { t } = useTranslation();

  return (
    <span className={styles.iconWrapper}>
      <PaletteIcon />
      <span className={styles.iconTitle}>
        {t(`themes.${theme}`)}
      </span>
    </span>
  );
};

export const ThemeSwitcher: FC<WithClassName> = ({ className }) => {
  const [themes] = useState<ThemeMode[]>(() => ['light', 'dark']);
  const [theme, setTheme] = useTheme();
  const { t } = useTranslation();

  return (
    <FormControl
      className={clsx(className, styles.root)}
      fullWidth
    >
      <InputLabel>{t('settings.theme.title')}</InputLabel>
      <Select
        value={theme}
        onChange={e => setTheme(e.target.value)}
        displayEmpty
        label={t('settings.theme.title')}
        renderValue={() => <IconWrapper theme={theme} />}
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
