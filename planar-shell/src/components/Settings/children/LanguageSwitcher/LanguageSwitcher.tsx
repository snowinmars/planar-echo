import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import getNativeLangNames from '@/shared/getNativeLangNames';
import FlagCz from '@/svg/flags/cz';
import FlagDe from '@/svg/flags/de';
import FlagEn from '@/svg/flags/en';
import FlagFr from '@/svg/flags/fr';
import FlagKo from '@/svg/flags/ko';
import FlagPl from '@/svg/flags/pl';
import FlagRu from '@/svg/flags/ru';
import TranslationSvg from '@/svg/translation';

import type { FC } from 'react';

import type { GameLanguage } from '@planar/shared';

import type { NativeLang } from '@/shared/getNativeLangNames';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './LanguageSwitcher.module.scss';

const LangWithFlag: FC<NativeLang & WithClassName> = ({ code, name, className }: NativeLang & WithClassName) => {
  return (
    <Grid container spacing={1} sx={{ width: '100%' }}>
      <Grid size={{ xs: 2 }}>
        { code === 'cs_CZ' && <FlagCz className={className} />}
        { code === 'de_DE' && <FlagDe className={className} />}
        { code === 'en_US' && <FlagEn className={className} />}
        { code === 'fr_FR' && <FlagFr className={className} />}
        { code === 'ko_KR' && <FlagKo className={className} />}
        { code === 'pl_PL' && <FlagPl className={className} />}
        { code === 'ru_RU' && <FlagRu className={className} />}
      </Grid>

      <Grid size={{ xs: 8 }}>
        <Typography>{name}</Typography>
      </Grid>

      <Grid size={{ xs: 2 }}>
        { code === 'cs_CZ' && <Typography className={styles.llmLang}>LLM</Typography>}
        { code === 'de_DE' && <Typography className={styles.llmLang}>LLM</Typography>}
        { code === 'fr_FR' && <Typography className={styles.llmLang}>LLM</Typography>}
        { code === 'ko_KR' && <Typography className={styles.llmLang}>LLM</Typography>}
        { code === 'pl_PL' && <Typography className={styles.llmLang}>LLM</Typography>}
      </Grid>
    </Grid>
  );
};

const IconWrapper: FC<NativeLang> = ({ code, name }: NativeLang) => {
  return (
    <span className={styles.iconWrapper}>
      <TranslationSvg className={styles.langIcon} />
      <span className={styles.iconTitle}>
        <LangWithFlag className={styles.flagIcon} code={code} name={name} />
      </span>
    </span>
  );
};

export const LanguageSwitcher: FC<WithClassName> = ({ className }) => {
  const { t, i18n } = useTranslation();
  const [languages] = useState<NativeLang[]>(() => getNativeLangNames(i18n.options.resources || {}));
  const [loading, setLoading] = useState(false);

  return (
    <FormControl
      className={className}
      fullWidth
    >
      <InputLabel>{t('settings.language.title')}</InputLabel>
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
        renderValue={() => <IconWrapper code={i18n.language as GameLanguage} name={languages.find(x => x.code === i18n.language)!.name} />}
      >
        {
          languages.map(lang => (
            <MenuItem key={lang.code} value={lang.code}>
              <LangWithFlag className={styles.flagIcon} code={lang.code} name={lang.name} />
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};
