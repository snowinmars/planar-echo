import {useState} from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import TranslationSvg from '@/svg/translation';
import styles from './LanguageSwitcher.module.scss';
import getNativeLangNames from './getNativeLangNames';

import type {FC} from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

export const LanguageSwitcher: FC<WithClassName> = ({className}) => {
  const { i18n } = useTranslation();
  const [languages] = useState(() => getNativeLangNames(i18n.options.resources || {}));

  return (
    <FormControl
      className={className}
      sx={{ minWidth: "5em" }}
    >
      <Select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value as 'en' | 'ru')}
        displayEmpty
        renderValue={() => <TranslationSvg className={styles.langIcon} />}
      >
        {
          languages.map(lang => (
            <MenuItem key={lang.code} value={lang.code}>
              <Typography>{lang.name}</Typography>
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};
