import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import TranslationSvg from '@/svg/translation';
import styles from './LanguageSwitcher.module.scss';
import getNativeLangNames from '@/shared/getNativeLangNames';
import InputLabel from '@mui/material/InputLabel';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { GameLanguage } from '@planar/shared';

type IconWrapperProps = Readonly<{
  language: string;
}>;
const IconWrapper: FC<IconWrapperProps> = ({ language }: IconWrapperProps) => {
  return (
    <span className={styles.iconWrapper}>
      <TranslationSvg className={styles.langIcon} />
      <span className={styles.iconTitle}>
        {language}
      </span>
    </span>
  );
};
export const LanguageSwitcher: FC<WithClassName> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const [languages] = useState(() => getNativeLangNames(i18n.options.resources || {}));
  const [loading, setLoading] = useState(false);

  return (
    <FormControl
      className={className}
      fullWidth
    >
      <InputLabel>{t('settings.language')}</InputLabel>
      <Select
        value={i18n.language}
        onChange={(e) => {
          setLoading(true);
          try {
            i18n.changeLanguage(e.target.value as GameLanguage)
              .then(() => {
                setLoading(false);
              })
              .catch((e) => {
                console.error(e);
                setLoading(false);
              });
          }
          catch (e: unknown) {
            console.error(e);
            setLoading(false);
          }
        }}
        disabled={loading}
        renderValue={() => <IconWrapper language={i18n.language} />}
      >
        {
          languages.map(lang => (
            <MenuItem disabled={lang.code !== 'ru_RU' && lang.code !== 'en_US'} key={lang.code} value={lang.code}>
              <Typography>{lang.name}</Typography>
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};
