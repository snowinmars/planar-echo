import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import getNativeLangNames from '@/shared/getNativeLangNames';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import type { FC } from 'react';

import styles from './Step1.module.scss';
import type { WithClassName } from '@/types/fcWithClassName';

type Language = 'ru' | 'en';

type Step1Props = WithClassName & Readonly<{
  setStatus: (x: boolean) => void;
  setLang: (x: Language) => void;
  imageUrl: string;
}>;
const Step1: FC<Step1Props> = ({
  className,
  setStatus,
  setLang,
  imageUrl,
}) => {
  const { i18n, t } = useTranslation();
  const [languages] = useState(() => getNativeLangNames(i18n.options.resources || {}));
  const [language, setLanguage] = useState<Language | ''>('');

  useEffect(() => {
    setStatus(!!language);
    if (language !== '') setLang(language);
  }, [language]);

  return (
    <Card className={className}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt="Choose language"
      />
      <CardContent className={styles.cardContent}>
        <FormControl
          className={styles.inputWrapper}
          fullWidth
        >
          <InputLabel id="landing-step1-language-label">{t('landing.step1.language')}</InputLabel>
          <Select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as Language);
            }}
            label={t('landing.step1.language')}
            labelId="landing-step1-language-label"
            fullWidth
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

        <Typography>
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Step1;
